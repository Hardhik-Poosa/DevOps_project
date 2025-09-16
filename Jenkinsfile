pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "hardhikpoosa/myapp"  // change to your Docker Hub repo name
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/<your-repo>.git'
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'    // Or pytest for Python
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker tag backend:latest $DOCKER_IMAGE-backend:latest"
                    sh "docker tag frontend:latest $DOCKER_IMAGE-frontend:latest"
                    sh "docker push $DOCKER_IMAGE-backend:latest"
                    sh "docker push $DOCKER_IMAGE-frontend:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/' // Make sure you have your k8s deployment YAMLs in a folder
            }
        }
    }
}