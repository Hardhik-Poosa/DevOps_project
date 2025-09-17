# MyApp-CI: 3-Tier Application CI/CD Pipeline

## Overview

This project demonstrates a complete CI/CD pipeline for a 3-tier application (Frontend, Backend, MongoDB) using:

- **Source Control:** GitHub
- **Containerization:** Docker
- **Registry:** Docker Hub
- **CI/CD Tool:** Jenkins
- **Orchestration:** Kubernetes (Minikube locally, with options for cloud deployment to EKS/GKE/AKS)

---

## Application Architecture

The application follows a 3-tier architecture:

```
  +-----------------+      +-------------------+      +-----------------+
  | Frontend        |      | Backend           |      | Database        |
  | (React/Vite)    | <--> | (Node.js/Express) | <--> | (MongoDB)       |
  +-----------------+      +-------------------+      +-----------------+
```

- **Frontend:** A modern user interface built with React, Vite, and styled with Tailwind CSS and shadcn/ui.
- **Backend:** A RESTful API service powered by Node.js and Express, handling business logic and data persistence.
- **Database:** A MongoDB database for storing application data.

All services are containerized using Docker and are designed to be deployed and managed by Kubernetes.

---

## Prerequisites

To get this project up and running, you'll need the following tools installed on your machine:

- Windows or Linux operating system
- Docker & Docker Compose
- Node.js & npm
- Minikube (for local Kubernetes deployment)
- kubectl CLI
- Jenkins (with necessary plugins like Docker, Kubernetes, etc.)
- Git & access to the GitHub repository
- A Docker Hub account

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Hardhik-Poosa/DevOps_project.git
cd DevOps_project
```

### 2. Backend Setup

```bash
cd backend
npm install

# Optional: run tests
npm test
```

### 3. Frontend Setup

```bash
cd .. 
npm install
npm run build
```

---

## Dockerization

You can build and run the entire application using Docker Compose.

**Build Docker images:**

```bash
docker-compose build
```

**Push images to Docker Hub:**

First, make sure you are logged into Docker Hub. Then, tag and push the images using the names defined in the `Jenkinsfile`:

```bash
docker tag myapp-ci-backend:latest hardhikpoosa/devops-backend:latest
docker tag myapp-ci-frontend:latest hardhikpoosa/devops-frontend:latest

docker push hardhikpoosa/devops-backend:latest
docker push hardhikpoosa/devops-frontend:latest
```

---

## Jenkins Pipeline

The `Jenkinsfile` in this project automates the entire CI/CD process using a declarative pipeline. Below is a detailed explanation of each part of the `Jenkinsfile`.

### Pipeline Configuration

-   **`pipeline { ... }`**: This is the main block that encloses the entire pipeline definition.
-   **`agent any`**: This specifies that the pipeline can run on any available Jenkins agent.
-   **`environment { ... }`**: This block defines environment variables that are available throughout the pipeline.
    -   `DOCKER_BACKEND_IMAGE` and `DOCKER_FRONTEND_IMAGE`: These variables store the names of the Docker images for the backend and frontend, making the pipeline more maintainable.

### Pipeline Stages

The `stages` block contains the individual stages of the CI/CD process.

#### Stage: Checkout Code

This stage clones the source code from the specified GitHub repository. The `credentialsId` is used to access the repository if it's private.

#### Stage: Run Backend Tests

This stage is responsible for running tests for the backend service.
-   **`dir('backend')`**: This step changes the current directory to `backend` before executing the commands.
-   **`script { ... }`**: This block allows for the execution of Groovy script, which is necessary for the `try-catch` block and the `if` condition.
-   **`isUnix()`**: This function checks if the Jenkins agent is a Unix-based system (like Linux or macOS). This allows the pipeline to be cross-platform.
-   **`sh` vs `bat`**: `sh` is used to execute shell commands on Unix-based systems, while `bat` is used for batch commands on Windows.
-   **`try-catch` block**: This ensures that even if the tests fail, the pipeline will not stop. It will print a message and continue to the next stage.

#### Stage: Build Docker Images

This stage builds the Docker images for the frontend and backend services using `docker-compose build`. It also uses the `isUnix()` check to run the appropriate command for the operating system.

#### Stage: Push to Docker Hub

This stage pushes the built Docker images to Docker Hub.
-   **`withCredentials`**: This step securely loads the Docker Hub credentials (stored in Jenkins as `dockerhub-cred`) into the `DOCKER_USER` and `DOCKER_PASS` environment variables.
-   The script then logs into Docker Hub, tags the images with the names defined in the `environment` block, and pushes them to the registry.

#### Stage: Deploy to Minikube

This stage deploys the application to a Kubernetes cluster.
-   **`withCredentials`**: This step loads the Kubernetes configuration file (kubeconfig) from Jenkins credentials.
-   The script then uses `kubectl` to apply the Kubernetes manifests located in the `k8s/` directory.

### Post-build Actions

The `post` block defines actions that are executed after all the stages have completed.
-   **`success`**: This block is executed if the pipeline completes successfully.
-   **`failure`**: This block is executed if the pipeline fails at any stage.

<details>
<summary>Click to see the full Jenkinsfile</summary>

```groovy
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

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        try {
                            if (isUnix()) {
                                sh 'npm install'
                                sh 'npm test'
                            } else {
                                bat 'npm install'
                                bat 'npm test'
                            }
                        } catch (err) {
                            echo "Tests failed, but continuing pipeline..."
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    if (isUnix()) {
                        sh "docker-compose build"
                    } else {
                        bat "docker-compose build"
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
                            bat "cmd /c echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                            bat "docker tag myapp-ci-backend:latest %DOCKER_BACKEND_IMAGE%:latest"
                            bat "docker tag myapp-ci-frontend:latest %DOCKER_FRONTEND_IMAGE%:latest"
                            bat "docker push %DOCKER_BACKEND_IMAGE%:latest"
                            bat "docker push %DOCKER_FRONTEND_IMAGE%:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([file(credentialsId: 'minikube-kubeconfig', variable: 'KUBECONFIG')]) {
                    script {
                        if (isUnix()) {
                            sh 'kubectl config current-context'
                            sh 'kubectl get nodes'
                            sh 'kubectl apply -f k8s/'
                        } else {
                            bat 'kubectl config current-context'
                            bat 'kubectl get nodes'
                            bat 'kubectl apply -f k8s/'
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline succeeded"
        }
        failure {
            echo "❌ Pipeline failed — check Console Output"
        }
    }
}
```
</details>

---

## Kubernetes Deployment (Local)

To deploy the application to your local Minikube cluster:

**Ensure Minikube is running:**

```bash
minikube start
```

**Apply the Kubernetes manifests:**

```bash
# The 'k8s' directory should contain your deployment and service YAML files
kubectl apply -f k8s/

# Check the status of your pods and services
kubectl get pods
kubectl get svc
```

---

## Future Improvements

- **Add comprehensive tests:** Implement real backend and frontend tests with Jest, Mocha, or other testing frameworks.
- **Deploy to a cloud Kubernetes cluster:** Configure the pipeline to deploy to a managed Kubernetes service like EKS, GKE, or AKS.
- **Use LoadBalancer or Ingress:** Implement a LoadBalancer or Ingress controller for public access to the application in a cloud environment.
- **Automate GitHub webhook triggers:** Set up webhooks in GitHub to automatically trigger the Jenkins pipeline on code pushes, enabling full CI/CD automation.

---

## Dependencies

### Backend Dependencies
- `bcryptjs`: For hashing passwords.
- `cors`: To enable Cross-Origin Resource Sharing.
- `dotenv`: To manage environment variables.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: For generating JSON Web Tokens for authentication.
- `mongoose`: Object Data Modeling (ODM) library for MongoDB.

### Frontend Dependencies
- `react`: A JavaScript library for building user interfaces.
- `vite`: A fast build tool for modern web projects.
- `react-router-dom`: For routing in the React application.
- `tailwindcss`: A utility-first CSS framework.
- `shadcn/ui`: A collection of re-usable UI components.
- `@tanstack/react-query`: For data fetching and state management.

---

## References

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
- [Docker Documentation](https://docs.docker.com/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
