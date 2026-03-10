{ pkgs }:

pkgs.nodePackages.buildNodePackage {
  pname = "amber-shell-v1";
  version = "0.1.0";
  src = ../;
  packageJSON = ../package.json;
  packageLock = ../package-lock.json;
  meta = {
    description = "Amber Shell v1";
    license = pkgs.lib.licenses.mit;
    maintainers = [];
  };
}
