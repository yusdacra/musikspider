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
      }: let
        packageJson = builtins.fromJSON (builtins.readFile ./package.json);
      in {
        devShells.default = config.mk-naked-shell.lib.mkNakedShell {
          name = "musikspider-devshell";
          packages = with pkgs; [
            nodejs-slim_latest bun
            nodePackages.svelte-language-server
            nodePackages.typescript-language-server
          ];
          shellHook = ''
            export PATH="$PATH:$PWD/node_modules/.bin"
          '';
        };
        packages.musikspider-modules = pkgs.stdenv.mkDerivation {
          pname = "${packageJson.name}-modules";
          version = packageJson.version;

          src = ./.;
          
          outputHash = "sha256-WyEPnQ/yx3Ig65lIqbBOUiRamHPEevwvOxd2vTdzjqE=";
          outputHashAlgo = "sha256";
          outputHashMode = "recursive";

          nativeBuildInputs = with pkgs; [bun];

          dontConfigure = true;
          impureEnvVars = pkgs.lib.fetchers.proxyImpureEnvVars
            ++ [ "GIT_PROXY_COMMAND" "SOCKS_SERVER" ];

          buildPhase = "bun install --no-progress --frozen-lockfile";
          installPhase = "mv node_modules $out";
        };
        packages.musikspider = pkgs.stdenv.mkDerivation {
          pname = packageJson.name;
          version = packageJson.version;

          src = ./.;

          nativeBuildInputs = [pkgs.makeBinaryWrapper];
          buildInputs = [pkgs.bun];

          LOCAL_MUSIKQUAD_SERVER="http://127.0.0.1:5505";
          PUBLIC_MUSIKQUAD_SERVER="127.0.0.1:5505";
          PUBLIC_BASEURL="localhost:5173";

          configurePhase = ''
            runHook preConfigure
            cp -R ${config.packages.musikspider-modules} node_modules
            substituteInPlace node_modules/.bin/vite \
              --replace "/usr/bin/env node" "${pkgs.nodejs-slim_latest}/bin/node"
            runHook postConfigure
          '';
          buildPhase = ''
            runHook preBuild
            bun --prefer-offline run build
            runHook postBuild
          '';
          installPhase = ''
            runHook preInstall

            mkdir -p $out/bin
            ln -s ${config.packages.musikspider-modules} $out
            cp -R ./build/* $out

            makeBinaryWrapper ${pkgs.bun}/bin/bun $out/bin/${packageJson.name} \
              --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.bun ]} \
              --add-flags "run --prefer-offline --no-install --cwd $out start"

            runHook postInstall
          '';
        };
        packages.default = config.packages.musikspider;
      };
    };
}
