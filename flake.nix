{
  description = "Web application for musikcube servers";

  inputs.parts.url = "github:hercules-ci/flake-parts";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.systems.url = "github:nix-systems/x86_64-linux";
  inputs.naked-shell.url = "github:yusdacra/mk-naked-shell";
  inputs.naked-shell.flake = false;

  outputs = inp:
    inp.parts.lib.mkFlake {inputs = inp;} {
      systems = import inp.systems;
      perSystem = {pkgs, ...}: let
        mkNakedShell = pkgs.callPackage inp.naked-shell {};
      in {
        devShells.default = mkNakedShell {
          name = "musikspider-devshell";
          packages = with pkgs; [deno];
        };
      };
    };
}
