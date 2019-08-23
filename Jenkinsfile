pipeline {
  agent any
  stages {
    stage('Build') {
	steps {
	configFileProvider([configFile(fileId: '3e84b596-c169-4fa4-83d0-444509c688d0', variable: 'config_file')]) {
        sh 'mv $config_file ./.env ; ./jenkins/scripts/build.sh'
	}
      }
    }
    stage('Test') {
      steps {
        sh './jenkins/scripts/test.sh'
      }
    }
    stage('Deliver for development') {
      when {
        branch 'development'
      }
      steps {
        sh './jenkins/scripts/deliver-for-development.sh'
        input 'Finished using the web site? (Click "Proceed" to continue)'
        sh './jenkins/scripts/kill.sh'
      }
    }
    stage('Deploy for production') {
      when {
        branch 'master'
      }
      steps {
        sh './jenkins/scripts/deploy-for-production.sh'
      }
    }
  }
  environment {
    CI = 'true'
  }
}
