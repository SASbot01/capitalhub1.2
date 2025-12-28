#!/bin/bash

# Script para crear un nuevo release de CapitalHub Desktop
# Uso: ./create-release.sh 1.0.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar un número de versión${NC}"
    echo -e "${YELLOW}Uso: ./create-release.sh 1.0.0${NC}"
    exit 1
fi

VERSION=$1
TAG="v${VERSION}"

echo -e "${GREEN}🚀 Creando release de CapitalHub Desktop${NC}"
echo -e "${YELLOW}Versión: ${TAG}${NC}"
echo ""

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: El tag ${TAG} ya existe${NC}"
    echo -e "${YELLOW}Para eliminar el tag existente:${NC}"
    echo "  git tag -d ${TAG}"
    echo "  git push origin :refs/tags/${TAG}"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: Tienes cambios sin commitear${NC}"
    echo -e "${YELLOW}Haz commit de tus cambios primero:${NC}"
    echo "  git add ."
    echo "  git commit -m 'Prepare release ${TAG}'"
    exit 1
fi

# Confirm
echo -e "${YELLOW}¿Estás seguro de crear el release ${TAG}? (y/n)${NC}"
read -r response
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${RED}❌ Cancelado${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📝 Creando tag ${TAG}...${NC}"
git tag -a "$TAG" -m "Release ${TAG}"

echo -e "${GREEN}📤 Subiendo tag a GitHub...${NC}"
git push origin "$TAG"

echo ""
echo -e "${GREEN}✅ ¡Listo!${NC}"
echo ""
echo -e "${YELLOW}🔄 GitHub Actions está compilando la aplicación para:${NC}"
echo "  - Windows (x64)"
echo "  - macOS Intel (x64)"
echo "  - macOS Apple Silicon (ARM64)"
echo "  - Linux (x64)"
echo ""
echo -e "${YELLOW}⏱️  Tiempo estimado: 15-20 minutos${NC}"
echo ""
echo -e "${GREEN}📦 Para ver el progreso:${NC}"
echo "  https://github.com/SASbot01/capitalhub1.1/actions"
echo ""
echo -e "${GREEN}🎉 Cuando termine, los instaladores estarán en:${NC}"
echo "  https://github.com/SASbot01/capitalhub1.1/releases/tag/${TAG}"
echo ""
