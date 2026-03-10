{
  description = "Amber Shell v1 package and development shell";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        package = import ./nix/package.nix { inherit pkgs; };
        devShell = import ./nix/devshell.nix { inherit pkgs; };
      in {
        packages.default = package;
        devShells.default = devShell;
      }
    );
}
