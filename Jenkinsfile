pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') 
        DOCKERHUB_REPO = 'gorgui/talent-plus-angular'            
        APP_NAME = 'talent-plus-angular'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📥 Clonage du dépôt...'
                checkout scm
            }
        }

        stage('Install & Build Angular') {
            steps {
                echo '📦 Installation des dépendances et build Angular...'
                sh 'npm install'
                sh 'npm run build -- --configuration=production'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Construction de l’image Docker...'
                sh """
                docker build -t ${DOCKERHUB_REPO}:latest .
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo '🔐 Connexion à Docker Hub...'
                sh """
                echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Envoi de l’image vers Docker Hub...'
                sh """
                docker push ${DOCKERHUB_REPO}:latest
                """
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline exécuté avec succès 🎉'
        }
        failure {
            echo '❌ Échec du pipeline'
        }
    }
}
