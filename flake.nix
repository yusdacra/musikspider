{
  description = "Web application for musikcube servers";

  inputs.parts.url = "github:hercules-ci/flake-parts";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.systems.url = "github:nix-systems/x86_64-linux";
  inputs.naked-shell.url = "github:yusdacra/mk-naked-shell";

  outputs = inp:
    inp.parts.lib.mkFlake {inputs = inp;} {
      systems = import inp.systems;
      imports = [inp.naked-shell.flakeModule];
      perSystem = {config, pkgs, ...}: {
        devShells.default = config.mk-naked-shell.lib.mkNakedShell {
          name = "musikspider-devshell";
          packages = with pkgs; [
            deno
            nodePackages_latest.vscode-json-languageserver
            taplo
          ];
        };
      };
    };
}
