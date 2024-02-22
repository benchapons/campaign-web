library 'spwretailautomation-jenkins-library'
buildImage(
  label:"build",
  registryId:"GITLAB-REGISTRY-CREDENTIAL",
  composeFile:"deployment/docker-compose.yml",
  imageName:"cx/campaign/campaign-management-web",
  appName:"campaign-management-web",
  nodeVersion:"16.17.0",
  sonarqubeSource:"./",
  sonarqubeInclusions:"./**/*.spec.ts"
)