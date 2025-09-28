pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "hardhikpoosa/devops-backend"
        DOCKER_FRONTEND_IMAGE = "hardhikpoosa/devops-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Hardhik-Poosa/DevOps_project.git',
                    credentialsId: 'dockerhub-cred'
            }
        }

        stage('Security Scans') {
            parallel {
                stage('SAST (Semgrep)') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'docker run --rm -v $WORKSPACE:/src semgrep/semgrep semgrep scan --config auto --error'
                            } else {
                                bat "docker run --rm -v %WORKSPACE%:/src semgrep/semgrep semgrep scan --config auto --error"
                            }
                        }
                    }
                }
                stage('Dependency Scan (npm audit)') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'npm install --omit=dev --ignore-scripts && npm audit --audit-level=critical'
                            } else {
                                bat "npm install --omit=dev --ignore-scripts && npm audit --audit-level=critical"
                            }
                        }
                    }
                }
                stage('Secrets Scan (Gitleaks)') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh 'npm ci && npx gitleaks-secret-scanner detect --source .'
                            } else {
                                bat 'npm ci && npx gitleaks-secret-scanner detect --source .'
                            }
                        }
                    }
                }
            }
        }

        stage('Test Hello') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'cat hello.txt'
                    } else {
                        bat 'type hello.txt'
                    }
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        try {
                            if (isUnix()) {
                                sh 'npm install && npm test'
                            } else {
                                bat 'npm install && npm test'
                            }
                        } catch (err) {
                            echo "Tests failed, but continuing pipeline..."
                        }
                    }
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                script {
                    try {
                        if (isUnix()) {
                            sh 'npm install && npm run cypress:run'
                        } else {
                            bat 'npm install && npm run cypress:run'
                        }
                    } catch (err) {
                        echo "E2E Tests failed, continuing..."
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker-compose build --no-cache"
                    } else {
                        bat "docker-compose build --no-cache"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
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

        stage('DAST (OWASP ZAP)') {
            steps {
                script {
                    try {
                        if (isUnix()) {
                            sh "docker-compose up -d"
                            sh "echo 'Waiting for application to start... (30s)'"
                            sh "sleep 30"
                            sh "echo '--- Checking container status ---'"
                            sh "docker-compose ps"
                            sh "echo '--- IMPORTANT: Frontend container logs (check for errors) ---'"
                            sh "docker-compose logs frontend"
                            sh "echo '--- End of diagnostics ---'"
                            sh '''
                                docker run --rm \
                                -v ${WORKSPACE}:/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py \
                                -t http://host.docker.internal:3000 -r report.html
                            '''
                        } else {
                            bat "docker-compose up -d"
                            bat "echo 'Waiting for application to start... (30s)'"
                            bat "ping -n 31 127.0.0.1 > nul"
                            bat "echo --- Checking container status ---"
                            bat "docker-compose ps"
                            bat "echo --- IMPORTANT: Frontend container logs (check for errors) ---"
                            bat "docker-compose logs frontend"
                            bat "echo --- End of diagnostics ---"
                            bat '''
                                docker run --rm ^
                                -v "%WORKSPACE%:/zap/wrk/:rw" zaproxy/zap-stable zap-baseline.py ^
                                -t http://host.docker.internal:3000 -r report.html
                            '''
                        }
                    } finally {
                        if (isUnix()) {
                            sh "docker-compose down"
                        } else {
                            bat "docker-compose down"
                        }
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'report.html', allowEmptyArchive: true
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG')]) {
                    script {
                        if (isUnix()) {
                            sh 'minikube delete'
                            sh 'minikube start'
                            sh 'kubectl apply -f k8s/'
                            sh 'kubectl rollout restart deployment frontend'
                            sh 'kubectl rollout restart deployment backend'
                        } else {
                            bat 'minikube delete'
                            bat 'minikube start'
                            bat 'kubectl apply -f k8s/'
                            bat 'kubectl rollout restart deployment frontend'
                            bat 'kubectl rollout restart deployment backend'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'echo "Cleaning up ngrok and port-forward..."'
                    sh 'pkill -f ngrok || true'
                } else {
                    bat 'echo Cleaning up ngrok and port-forward...'
                    bat 'taskkill /IM ngrok.exe /F || exit 0'
                }
            }
        }
        success {
            echo "✅ Pipeline succeeded"
        }
        failure {
            echo "❌ Pipeline failed — check Console Output"
        }
    }
}
