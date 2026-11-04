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
    ACR_NAME   = 'idp2026booklub'          
    SUB_ID     = '9b417f38-2f62-44d0-ba34-c78f9b3e7bd5'           
    APP_URL    = "https://book-club-backend-eka7e3fkf5dkfdb4.southeastasia-01.azurewebsites.net"
    IMAGE_REPO = "idp2026booklub.azurecr.io/book-club-backend"
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
          az webapp config set \
            --resource-group "$RG" \
            --name "$APP_NAME" \
            --linux-fx-version "DOCKER|$IMAGE_REPO:$IMAGE_TAG" > /dev/null
          az webapp restart --resource-group "$RG" --name "$APP_NAME"
        '''
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