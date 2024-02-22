library 'spwretailautomation-jenkins-library'
reTagImage(
  label:"build",
  registryId: "HARBOR-DEV-CREDENTIAL",
  registryURL: "https://harbor-dev.onesiam.com",
  registryDomain: "harbor-dev.onesiam.com",
  imageName:"cx/campaign/campaign-management-web"
)