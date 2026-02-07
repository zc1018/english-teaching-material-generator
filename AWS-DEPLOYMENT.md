# AWS 部署指南

## 部署架构

```
┌─────────────────────────────────────────────┐
│              AWS Cloud                       │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │         Application Load Balancer       │ │
│  │         (可选 - 用于 HTTPS)             │ │
│  └──────────────┬─────────────────────────┘ │
│                 │                            │
│  ┌──────────────▼─────────────────────────┐ │
│  │          EC2 Instance                   │ │
│  │                                         │ │
│  │  ┌─────────────┐    ┌────────────────┐│ │
│  │  │   Frontend  │    │    Backend     ││ │
│  │  │   (Nginx)   │───▶│   (Node.js)    ││ │
│  │  │   Port 80   │    │   Port 3000    ││ │
│  │  └─────────────┘    └────────────────┘│ │
│  │                                         │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │     ECR (Container Registry)            │ │
│  │  - english-teaching-backend:latest      │ │
│  │  - english-teaching-frontend:latest     │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 方案选择

### 方案 1: Docker + EC2 (推荐)
**优点**: 简单、成本低、易于管理
**适合**: 中小型应用、预算有限

### 方案 2: ECS Fargate
**优点**: 无需管理服务器、自动扩展
**适合**: 需要高可用性、流量波动大

### 方案 3: Elastic Beanstalk
**优点**: 全托管、自动化部署
**适合**: 快速上线、不想管理基础设施

---

## 方案 1: Docker + EC2 部署 (详细步骤)

### 前置要求

1. **AWS 账户**
   - 注册 AWS 账户: https://aws.amazon.com/
   - 配置 IAM 用户和访问密钥

2. **本地工具**
   ```bash
   # 安装 AWS CLI
   brew install awscli  # macOS
   # 或访问: https://aws.amazon.com/cli/

   # 安装 Docker
   brew install docker  # macOS
   # 或访问: https://docs.docker.com/get-docker/
   ```

3. **配置 AWS CLI**
   ```bash
   aws configure
   # 输入:
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Default region (例如: us-east-1)
   # - Default output format (json)
   ```

---

### 步骤 1: 准备环境变量

```bash
# 复制环境变量模板
cp .env.production.example .env.production

# 编辑 .env.production,填入实际值
nano .env.production
```

**必填配置**:
```env
ANTHROPIC_AUTH_TOKEN=sk-your-actual-token-here
ANTHROPIC_BASE_URL=https://v3.codesome.cn
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

---

### 步骤 2: 本地测试

```bash
# 构建并启动容器
docker-compose up --build

# 测试访问
# 前端: http://localhost
# 后端: http://localhost:3000/api/health

# 停止容器
docker-compose down
```

---

### 步骤 3: 创建 ECR 仓库并推送镜像

```bash
# 运行部署脚本
./deploy-aws.sh

# 或手动执行:
REGION=us-east-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# 创建 ECR 仓库
aws ecr create-repository --repository-name english-teaching-backend --region $REGION
aws ecr create-repository --repository-name english-teaching-frontend --region $REGION

# 登录 ECR
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# 构建并推送后端镜像
docker build -t english-teaching-backend:latest ./backend
docker tag english-teaching-backend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-backend:latest

# 构建并推送前端镜像
docker build -t english-teaching-frontend:latest ./frontend
docker tag english-teaching-frontend:latest \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-frontend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-frontend:latest
```

---

### 步骤 4: 创建 EC2 实例

#### 4.1 通过 AWS 控制台创建

1. 登录 AWS 控制台
2. 进入 EC2 服务
3. 点击 "Launch Instance"
4. 配置:
   - **Name**: english-teaching-generator
   - **AMI**: Amazon Linux 2023
   - **Instance type**: t3.medium (2 vCPU, 4GB RAM)
   - **Key pair**: 创建或选择现有密钥对
   - **Network settings**:
     - 允许 SSH (22)
     - 允许 HTTP (80)
     - 允许 HTTPS (443)
   - **Storage**: 20 GB gp3
5. 点击 "Launch instance"

#### 4.2 通过 AWS CLI 创建

```bash
# 创建安全组
aws ec2 create-security-group \
  --group-name english-teaching-sg \
  --description "Security group for English Teaching Generator" \
  --region us-east-1

# 添加入站规则
SG_ID=$(aws ec2 describe-security-groups \
  --group-names english-teaching-sg \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# 启动实例
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair-name \
  --security-group-ids $SG_ID \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=english-teaching-generator}]'
```

---

### 步骤 5: 配置 EC2 实例

```bash
# SSH 到实例
ssh -i your-key.pem ec2-user@your-instance-public-ip

# 安装 Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 重新登录以应用 docker 组权限
exit
ssh -i your-key.pem ec2-user@your-instance-public-ip
```

---

### 步骤 6: 部署应用

```bash
# 登录 ECR
REGION=us-east-1
ACCOUNT_ID=your-account-id
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# 创建项目目录
mkdir -p ~/english-teaching-generator
cd ~/english-teaching-generator

# 创建 docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  backend:
    image: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-backend:latest
    container_name: backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ANTHROPIC_AUTH_TOKEN=your-token-here
      - ANTHROPIC_BASE_URL=https://v3.codesome.cn
      - ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
    networks:
      - app-network

  frontend:
    image: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/english-teaching-frontend:latest
    container_name: frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查状态
docker-compose ps
```

---

### 步骤 7: 配置域名 (可选)

#### 7.1 获取 Elastic IP

```bash
# 分配 Elastic IP
aws ec2 allocate-address --domain vpc

# 关联到实例
aws ec2 associate-address \
  --instance-id your-instance-id \
  --allocation-id your-allocation-id
```

#### 7.2 配置 DNS

1. 在域名注册商处添加 A 记录
2. 指向 Elastic IP

#### 7.3 配置 HTTPS (使用 Let's Encrypt)

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 方案 2: ECS Fargate 部署 (简化版)

### 步骤 1: 创建 ECS 集群

```bash
aws ecs create-cluster --cluster-name english-teaching-cluster
```

### 步骤 2: 创建任务定义

创建 `task-definition.json`:

```json
{
  "family": "english-teaching",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/english-teaching-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    },
    {
      "name": "frontend",
      "image": "ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/english-teaching-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

### 步骤 3: 注册任务定义

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 步骤 4: 创建服务

```bash
aws ecs create-service \
  --cluster english-teaching-cluster \
  --service-name english-teaching-service \
  --task-definition english-teaching \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## 维护和监控

### 查看日志

```bash
# Docker Compose
docker-compose logs -f

# 单个容器
docker logs -f backend
docker logs -f frontend
```

### 更新应用

```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 或者重新构建
docker-compose up -d --build
```

### 备份数据

```bash
# 备份上传的文件
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# 上传到 S3
aws s3 cp uploads-backup-*.tar.gz s3://your-backup-bucket/
```

### 监控资源

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

---

## 成本估算

### EC2 方案 (每月)
- **t3.medium 实例**: ~$30
- **20GB EBS 存储**: ~$2
- **数据传输**: ~$10 (100GB)
- **Elastic IP**: 免费 (关联到运行实例)
- **总计**: ~$42/月

### ECS Fargate 方案 (每月)
- **1 vCPU, 2GB RAM**: ~$30
- **数据传输**: ~$10
- **总计**: ~$40/月

---

## 故障排查

### 问题 1: 容器无法启动

```bash
# 查看日志
docker-compose logs backend
docker-compose logs frontend

# 检查环境变量
docker-compose config
```

### 问题 2: 无法访问应用

```bash
# 检查端口
sudo netstat -tulpn | grep -E '80|3000'

# 检查防火墙
sudo iptables -L

# 检查安全组
aws ec2 describe-security-groups --group-ids sg-xxx
```

### 问题 3: API 调用失败

```bash
# 测试后端健康检查
curl http://localhost:3000/api/health

# 检查环境变量
docker exec backend env | grep ANTHROPIC
```

---

## 安全建议

1. **使用 HTTPS**: 配置 SSL/TLS 证书
2. **限制 SSH 访问**: 只允许特定 IP
3. **定期更新**: 保持系统和依赖最新
4. **使用 Secrets Manager**: 存储敏感信息
5. **启用 CloudWatch**: 监控和告警
6. **定期备份**: 自动化备份流程

---

## 下一步

1. ✅ 完成 Docker 配置
2. ✅ 创建部署脚本
3. ⏳ 执行部署
4. ⏳ 配置域名和 HTTPS
5. ⏳ 设置监控和告警

---

## 支持

如有问题,请查看:
- [AWS 文档](https://docs.aws.amazon.com/)
- [Docker 文档](https://docs.docker.com/)
- [项目 GitHub](https://github.com/zc1018/english-teaching-material-generator)

---

**最后更新**: 2026-02-07
**维护者**: Claude Sonnet 4.5
