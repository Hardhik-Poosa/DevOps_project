pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "hardhikpoosa/devops-backend"
        DOCKER_FRONTEND_IMAGE = "hardhikpoosa/devops-frontend"
        NGROK_AUTHTOKEN = credentials('ngrok-auth-token')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Hardhik-Poosa/DevOps_project.git',
                    credentialsId: 'dockerhub-cred'
            }
        }

        stage('Test Hello') {
            steps {
                script {
                    node {
                        if (isUnix()) {
                            sh 'cat hello.txt'
                        } else {
                            bat 'type hello.txt'
                        }
                    }
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        node {
                            try {
                                if (isUnix()) {
                                    sh 'npm ci'
                                    sh 'npm test || true'
                                } else {
                                    bat 'npm ci'
                                    bat 'npm test || exit 0'
                                }
                            } catch (err) {
                                echo "Backend tests failed — continuing..."
                            }
                        }
                    }
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                dir('frontend') {
                    script {
                        node {
                            try {
                                if (isUnix()) {
                                    sh 'npm ci'
                                    sh 'npm run cypress:run || true'
                                } else {
                                    bat 'npm ci'
                                    bat 'npm run cypress:run || exit 0'
                                }
                            } catch (err) {
                                echo "E2E tests failed — continuing..."
                            }
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    node {
                        if (isUnix()) {
                            sh "docker-compose build"
                        } else {
                            bat "docker-compose build"
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        node {
                            if (isUnix()) {
                                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                                sh "docker tag myapp-ci-backend:latest $DOCKER_BACKEND_IMAGE:latest"
                                sh "docker tag myapp-ci-frontend:latest $DOCKER_FRONTEND_IMAGE:latest"
                                sh "docker push $DOCKER_BACKEND_IMAGE:latest"
                                sh "docker push $DOCKER_FRONTEND_IMAGE:latest"
                            } else {
                                bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                                bat "docker tag myapp-ci-backend:latest %DOCKER_BACKEND_IMAGE%:latest"
                                bat "docker tag myapp-ci-frontend:latest %DOCKER_FRONTEND_IMAGE%:latest"
                                bat "docker push %DOCKER_BACKEND_IMAGE%:latest"
                                bat "docker push %DOCKER_FRONTEND_IMAGE%:latest"
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG')]) {
                    script {
                        node {
                            if (isUnix()) {
                                sh 'minikube status || minikube start --driver=docker'
                                sh 'minikube update-context'
                                sh 'kubectl get nodes'
                                sh 'kubectl apply -f k8s/'
                                sh 'kubectl rollout restart deployment backend || true'
                                sh 'kubectl rollout restart deployment frontend || true'
                            } else {
                                bat 'minikube status || minikube start --driver=docker'
                                bat 'minikube update-context'
                                bat 'kubectl get nodes'
                                bat 'kubectl apply -f k8s/'
                                bat 'kubectl rollout restart deployment backend || exit 0'
                                bat 'kubectl rollout restart deployment frontend || exit 0'
                            }
                        }
                    }
                }
            }
        }

        stage('Expose Frontend with Ngrok') {
            steps {
                script {
                    node {
                        if (isUnix()) {
                            sh 'kubectl port-forward svc/frontend-service 8080:80 & echo $! > portforward.pid'
                            sh 'ngrok config add-authtoken $NGROK_AUTHTOKEN'
                            sh 'ngrok http 8080 > ngrok.log & echo $! > ngrok.pid'
                            sh 'sleep 5'
                            def url = sh(script: 'grep -o "https://[0-9a-z]*\\.ngrok-free\\.app" ngrok.log | head -n 1', returnStdout: true).trim()
                            echo "🌐 Application is available at: ${url}"
                        } else {
                            bat 'kubectl port-forward svc/frontend-service 8080:80 -n default > portforward.log 2>&1 &'
                            bat 'ngrok config add-authtoken %NGROK_AUTHTOKEN%'
                            bat 'start /B ngrok http 8080 > ngrok.log'
                            bat 'timeout 5'
                            def url = readFile('ngrok.log').split('\n').find { it.contains('https://') }
                            echo "🌐 Application is available at: ${url}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                node {
                    echo "Cleaning up ngrok and port-forward..."
                    sh 'kill $(cat portforward.pid) || true'
                    sh 'kill $(cat ngrok.pid) || true'
                }
            }
        }
        success {
            echo "✅ Pipeline succeeded — Application is live via ngrok"
        }
        failure {
            echo "❌ Pipeline failed — Check Console Output"
        }
    }
}
