#!/bin/bash

# AWS 部署脚本
# 使用 Docker + EC2 部署英语教材生成器

set -e

echo "🚀 开始部署到 AWS..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必要的工具
check_requirements() {
    echo "📋 检查部署要求..."

    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI 未安装${NC}"
        echo "请安装 AWS CLI: https://aws.amazon.com/cli/"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        echo "请安装 Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi

    echo -e "${GREEN}✅ 所有要求已满足${NC}"
}

# 配置 AWS 凭证
configure_aws() {
    echo "🔐 检查 AWS 配置..."

    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${YELLOW}⚠️  AWS 未配置或凭证无效${NC}"
        echo "请运行: aws configure"
        exit 1
    fi

    echo -e "${GREEN}✅ AWS 配置有效${NC}"
}

# 创建 ECR 仓库
create_ecr_repos() {
    echo "📦 创建 ECR 仓库..."

    REGION=${AWS_REGION:-us-east-1}
    BACKEND_REPO="english-teaching-backend"
    FRONTEND_REPO="english-teaching-frontend"

    # 创建后端仓库
    aws ecr describe-repositories --repository-names $BACKEND_REPO --region $REGION &> /dev/null || \
        aws ecr create-repository --repository-name $BACKEND_REPO --region $REGION

    # 创建前端仓库
    aws ecr describe-repositories --repository-names $FRONTEND_REPO --region $REGION &> /dev/null || \
        aws ecr create-repository --repository-name $FRONTEND_REPO --region $REGION

    echo -e "${GREEN}✅ ECR 仓库已创建${NC}"
}

# 构建并推送 Docker 镜像
build_and_push() {
    echo "🔨 构建 Docker 镜像..."

    REGION=${AWS_REGION:-us-east-1}
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_URL="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

    # 登录 ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URL

    # 构建后端镜像
    echo "构建后端镜像..."
    docker build -t english-teaching-backend:latest ./backend
    docker tag english-teaching-backend:latest $ECR_URL/english-teaching-backend:latest
    docker push $ECR_URL/english-teaching-backend:latest

    # 构建前端镜像
    echo "构建前端镜像..."
    docker build -t english-teaching-frontend:latest ./frontend
    docker tag english-teaching-frontend:latest $ECR_URL/english-teaching-frontend:latest
    docker push $ECR_URL/english-teaching-frontend:latest

    echo -e "${GREEN}✅ 镜像已推送到 ECR${NC}"
}

# 创建 EC2 实例
create_ec2_instance() {
    echo "🖥️  创建 EC2 实例..."

    # 这里需要根据实际情况配置
    echo -e "${YELLOW}⚠️  请手动创建 EC2 实例或使用 Terraform/CloudFormation${NC}"
    echo "推荐配置:"
    echo "  - 实例类型: t3.medium 或更高"
    echo "  - AMI: Amazon Linux 2023"
    echo "  - 安全组: 开放 80, 443, 22 端口"
    echo "  - 存储: 至少 20GB"
}

# 主函数
main() {
    echo "================================"
    echo "  英语教材生成器 AWS 部署"
    echo "================================"
    echo ""

    check_requirements
    configure_aws
    create_ecr_repos
    build_and_push
    create_ec2_instance

    echo ""
    echo -e "${GREEN}🎉 部署准备完成!${NC}"
    echo ""
    echo "下一步:"
    echo "1. 创建 EC2 实例"
    echo "2. SSH 到实例: ssh -i your-key.pem ec2-user@your-instance-ip"
    echo "3. 安装 Docker: sudo yum install -y docker && sudo systemctl start docker"
    echo "4. 拉取镜像并运行容器"
    echo ""
}

main "$@"
