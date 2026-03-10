{ pkgs }:

pkgs.mkShell {
  name = "amber-shell-v1-dev";
  buildInputs = [pkgs.nodejs-20_x pkgs.nodePackages.typescript pkgs.nodePackages.vitest];
  shellHook = ''
    echo "Amber Shell devshell ready"
  '';
}
