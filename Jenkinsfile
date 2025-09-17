pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "hardhikpoosa/devops-backend"
        DOCKER_FRONTEND_IMAGE = "hardhikpoosa/devops-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Hardhik-Poosa/DevOps_project.git'
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
                    sh "docker tag backend:latest $DOCKER_BACKEND_IMAGE:latest"
                    sh "docker tag frontend:latest $DOCKER_FRONTEND_IMAGE:latest"
                    sh "docker push $DOCKER_BACKEND_IMAGE:latest"
                    sh "docker push $DOCKER_FRONTEND_IMAGE:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/' // Make sure you have your k8s deployment YAMLs in a folder
            }
        }
    }
    post {
        success { echo "Pipeline succeeded" }
        failure { echo "Pipeline failed — check Console Output" }
    }
}
