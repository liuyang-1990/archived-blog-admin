pipeline {
    agent {
        docker {
            image 'node:10-alpine' 
            args '-p 3000:3000' 
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') { 
            steps {
                sh 'node -v'
                sh 'yarn -v'
                sh 'npm install' 
            }
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm run build' 
                sh 'ls dist'
            }
        }
    }
}