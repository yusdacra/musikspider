{
  description = "Web application for musikcube servers";

  inputs.parts.url = "github:hercules-ci/flake-parts";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  inputs.systems.url = "github:nix-systems/x86_64-linux";
  inputs.naked-shell.url = "github:yusdacra/mk-naked-shell";

  outputs = inp:
    inp.parts.lib.mkFlake {inputs = inp;} {
      systems = import inp.systems;
      imports = [
        inp.naked-shell.flakeModule
      ];
      perSystem = {
        config,
        pkgs,
        system,
        ...
      }: {
        devShells.default = config.mk-naked-shell.lib.mkNakedShell {
          name = "musikspider-devshell";
          packages = with pkgs; [nodejs yarn];
        };
        packages.musikspider = pkgs.mkYarnPackage {
          src = ./.;

          buildPhase = "HOME=$TMPDIR yarn --offline build";
          distPhase = "true";
          installPhase = "mv deps/musikspider/build $out";
        };
        packages.default = config.packages.musikspider;
      };
    };
}
