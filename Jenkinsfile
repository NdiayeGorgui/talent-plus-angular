pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKERHUB_REPO = 'gorgui/talent-plus-angular'
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
                echo '📦 Installation des dépendances...'
                bat 'npm install'

                echo '🏗️ Build Angular...'
                bat 'npm run build -- --configuration=production'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Construction de l’image Docker...'
                bat "docker build -t ${DOCKERHUB_REPO}:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo '🔐 Connexion à Docker Hub...'
                bat """
                echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '📤 Push de l’image...'
                bat "docker push ${DOCKERHUB_REPO}:latest"
            }
        }
    }

    post {
        success { echo '✅ Pipeline terminé avec succès 🎉' }
        failure { echo '❌ Échec du pipeline' }
    }
}
