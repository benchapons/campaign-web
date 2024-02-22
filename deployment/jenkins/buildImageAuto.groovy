library 'spwretailautomation-jenkins-library'
buildImageHarbor(
  commitTagBranch: "main",
  label:"build",
  registryId: "HARBOR-DEV-CREDENTIAL",
  registryURL: "harbor-dev.onesiam.com",
  composeFile:"deployment/docker-compose.yml",
  imageName:"cx/campaign/campaign-management-web",
  appName:"campaign-management-web",
  nodeVersion:"16.17.0",
  sonarqubeSource:"./",
  sonarqubeInclusions:"./**/*.spec.ts"
)