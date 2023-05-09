`musikspider` is a web client that works with `musikquadrupled`. It is made using SvelteKit. WIP.

![image](https://github.com/yusdacra/musikspider/assets/19897088/d5b407cf-ea14-4c62-af79-453fed84bace)

# Development

- Get `yarn` and `nodejs`.
- Run `yarn dev` for development server.
- Run `yarn build` for production build.

You can also use the provided Nix development shell if you are using Nix flakes.
A production build is also available at `packages.x86_64-linux.musikspider`.

# TODOs

- [x] basic music playing and controls
- [ ] implement playlists (local and remote)
- [ ] implement album and artist viewing
- [ ] implement persistence of music data, playlists and such
- [ ] implement scrobbling (last.fm, etc)
- [ ] implement discord status
- [ ] add tauri app?
