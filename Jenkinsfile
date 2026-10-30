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
    SQL_SERVER = 'book-club-idp-2026.database.windows.net'
    SQL_DB     = 'book-club'
    APP_URL    = "https://book-club-backend-eka7e3fkf5dkfdb4.southeastasia-01.azurewebsites.net"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Install') { steps { sh 'node -v && npm -v && npm ci' } }

    stage('Test') { steps { sh 'npm test --if-present' } }

    stage('Package') {
      steps {
        sh '''
          npm ci --omit=dev
          rm -f app.zip
          zip -qr app.zip . -x ".git/*" "app.zip" "Jenkinsfile"
        '''
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([
          string(credentialsId: 'azure-client-id',       variable: 'AZ_CLIENT_ID'),
          string(credentialsId: 'azure-client-secret',   variable: 'AZ_CLIENT_SECRET'),
          string(credentialsId: 'azure-tenant-id',       variable: 'AZ_TENANT_ID'),
          string(credentialsId: 'azure-subscription-id', variable: 'AZ_SUB_ID')
        ]) {
          sh '''
            az login --service-principal -u "$AZ_CLIENT_ID" -p "$AZ_CLIENT_SECRET" --tenant "$AZ_TENANT_ID" > /dev/null
            az account set --subscription "$AZ_SUB_ID"
            az webapp deploy --resource-group "$RG" --name "$APP_NAME" --src-path app.zip --type zip
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'az logout || true'
      cleanWs()
    }
  }
}