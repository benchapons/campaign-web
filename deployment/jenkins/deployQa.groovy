library 'spwretailautomation-jenkins-library'
deployNewLZHarborTag(
  label:"qa",
  cceId:"CCE-LANDING-QA-CREDENTIAL",
  cceURL:"CCE-LANDING-QA-URL",
  registryDomain: "harbor-dev.onesiam.com",
  registryURL: "https://harbor-dev.onesiam.com",
  imagePullSecrets:"habor-dev-registry",
  imageName:"cx/campaign/campaign-management-web",
  appName:"campaign-management-web",
  nameSpace:"customer-experience",
  deploymentFile:"deployment/kubernetes/kubernetes-nonprod.yaml",
  configMapName:"campaign-management-web-qa",
  kubeSecretName:"campaign-management-web-qa"
)