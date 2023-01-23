pipeline{
    
    environment{
    DATE=new Date().format('yy.M')
    TAG = "${DATE}.${BUILD_NUMBER}"
    
}
agent any 
stages{
 
     stage("Build Docker for Development"){
         when{
             branch "develop"
         }
        steps{
           script{
               docker.build("**.*.**.**:****/dispute-managment-front-end:${TAG}","--build-arg config=staging --no-cache .")
           }
        }
    }
      stage("Build Docker for Production"){
         when{
             branch "main"
         }
        steps{
           script{
               docker.build("**.*.**.**:****/dispute-managment-front-end:${TAG}","--build-arg config=production  --no-cache .")
           }
        }
    }
    stage("Push Docker Image to Local Registry"){
        steps{
           script{
               docker.withRegistry("http://**.*.**.**:****"){
                   docker.image("**.*.**.**:****/dispute-managment-front-end:${TAG}").push()
                   docker.image("**.*.**.**:****/dispute-managment-front-end:${TAG}").push("latest")
               }
           }
        }
    }
    stage("Deliver for development"){
        when{
            branch "develop"
        }
                 steps{
                    sshagent(['ebdev']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l  ebdevuat **.*.**.**    "docker stop dispute-managment-front-end  | true;     docker rm dispute-managment-front-end  | true;     docker run -p 5006:80  -d --name dispute-managment-front-end  **.*.**.**:****/dispute-managment-front-end:${TAG}"'
                }
        }
    }
      stage("Deploy for production"){
        when{
            branch "main"
        }
        
           steps{
                    sshagent(['enat-remedy-production']) {
                    sh 'ssh -o StrictHostKeyChecking=no -l  administrator **.*.**.**     "docker stop dispute-managment-front-end  | true;     docker rm dispute-managment-front-end  | true;     docker run -p 5006፡80 -d --name dispute-managment-front-end  **.*.**.**:****/dispute-managment-front-end:${TAG}"' 
                }
            }
        
    }
}
post{
    always{
        cleanWs()
    }
}
}
