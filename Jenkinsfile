pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    RG         = 'book-club'                     
    APP_NAME   = 'book-club-backend'
    ACR_NAME   = 'REPLACE_WITH_ACR_NAME'          // ชื่อ Azure Container Registry (ไม่ต้องใส่ .azurecr.io)
    SUB_ID     = 'REPLACE_WITH_SUBSCRIPTION_ID'   // ไม่ใช่ secret เก็บในไฟล์ได้                  
    APP_URL    = "https://book-club-backend-eka7e3fkf5dkfdb4.southeastasia-01.azurewebsites.net"
    IMAGE_REPO = "idp2026bookclub.azurecr.io/book-club-backend"
    IMAGE_TAG  = "0.0.1"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }
 
    stage('Install & Test') {
      steps {
        sh 'node -v && npm -v && npm ci'
        sh 'npm test --if-present'
      }
    }
 
    stage('Build Image') {
      steps {
        sh 'docker build -t "$IMAGE_REPO:$IMAGE_TAG" -t "$IMAGE_REPO:latest" .'
      }
    }
 
    stage('Push Image') {
      steps {
        sh '''
          az login --identity > /dev/null
          az account set --subscription "$SUB_ID"
          az acr login --name "$ACR_NAME"
          docker push "$IMAGE_REPO:$IMAGE_TAG"
          docker push "$IMAGE_REPO:latest"
        '''
      }
    }
 
    stage('Deploy') {
      steps {
        sh '''
          az webapp config container set \
            --resource-group "$RG" \
            --name "$APP_NAME" \
            --container-image-name "$IMAGE_REPO:$IMAGE_TAG" \
            --container-registry-url "https://${ACR_NAME}.azurecr.io" > /dev/null
          az webapp restart --resource-group "$RG" --name "$APP_NAME"
        '''
      }
    }
 
    stage('Smoke Test') {
      steps {
        // เปลี่ยน APP_URL ให้ชี้ไป health endpoint ถ้ามี
        sh 'curl -fsS --retry 10 --retry-delay 6 --retry-all-errors "$APP_URL" > /dev/null'
      }
    }
  }
 
  post {
    always {
      sh '''
        docker rmi "$IMAGE_REPO:$IMAGE_TAG" "$IMAGE_REPO:latest" || true
        docker logout "${ACR_NAME}.azurecr.io" || true
        az logout || true
      '''
      cleanWs()
    }
  }
}