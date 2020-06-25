$(document).ready(() => {
  console.log = (log) => {
    $("pre").append(log);
    setTimeout(() => {
      $("pre").text("");
    }, 3000);
  };
  const fs = require("fs");
  const exec = require("child_process").exec;
  const path = require("path");
  const os = require("os");
  const homedir = os.homedir();
  let dir = homedir.split(path.sep);
  let currentpath;
  let filelist = [];
  let init;
  currentpath = path.resolve(path.normalize(path.join(...dir)));
  $("title").text("AlEx - " + currentpath);
  function cd(newfolder) {
    dir.push(newfolder);
    currentpath = path.resolve(path.normalize(path.resolve(...dir)));
    let xdd = `<tr><td><button style="background-color:yellow;" class="backpoint">..</button></td><td></td><td>true</td><td></td></tr>`;
    if (currentpath == path.resolve("/")) {
      xdd = "";
    }
    $("title").text("AlEx - " + currentpath);
    $("table").html(
      `<tr><td>Filename</td><td>Details</td><td>IsDir</td><td>Remove</td></tr>${xdd}`
    );
    init();
  }
  function hbck() {
    cd(homedir);
  }
  $("button.home.button").click(hbck);
  $("button.rel.button").click(() => {
    cd(currentpath);
  });
  function getCommandLine() {
    switch (os.platform()) {
      case "darwin":
        return "open";
      case "win32":
        return "start";
      case "win64":
        return "start";
      default:
        return "xdg-open";
    }
  }
  const cml = getCommandLine();
  init = () => {
    $("button.backpoint").click(() => {
      cd("..");
    });
    fs.readdir(currentpath, (err, files) => {
      filelist = files;
      for (let file of files) {
        fs.stat(
          path.resolve(path.normalize(path.join(currentpath, file))),
          (errs, statss) => {
            let fa = "";
            let xxdel = "";
            if (!statss.isFile()) {
              fa = ' style="background-color:yellow;"';
            } else {
              xxdel = `<button style="background-color:red" class="d${file
                .replace(".", "po")
                .replace(" ", "px")}">Delete</button>`;
            }
            $("table").append(
              `<tr><td><button${fa} class="a${file
                .replace(".", "po")
                .replace(" ", "px")}">${file}</button></td><td>${
                "Size: " + statss.size
              }bytes</td><td>${statss.isDirectory()}</td><td>${xxdel}</td></tr>`
            );
            if (statss.isFile()) {
              $("button.d" + file.replace(".", "po").replace(" ", "px")).click(
                () => {
                  fs.chmodSync(
                    path.resolve(path.normalize(path.join(currentpath, file))),
                    0o777
                  );
                  fs.unlink(
                    path.resolve(path.normalize(path.join(currentpath, file))),
                    (err) => {
                      if (err) {
                        console.log("err: " + err);
                      } else {
                        $("pre").append(
                          "File " +
                            path.resolve(
                              path.normalize(path.join(currentpath, file))
                            ) +
                            " Removed"
                        );
                        cd(currentpath);
                      }
                      setTimeout(() => {
                        $("pre").html("");
                      }, 3000);
                    }
                  );
                }
              );
            }
            $("button.a" + file.replace(".", "po").replace(" ", "px")).click(
              () => {
                fs.stat(
                  path.resolve(path.normalize(path.join(currentpath, file))),
                  (err, stats) => {
                    if (err) {
                      console.log(err);
                    } else {
                      if (stats.isDirectory()) {
                        cd(file);
                      } else {
                        exec(
                          cml +
                            " " +
                            path.resolve(
                              path.normalize(path.join(currentpath, file))
                            )
                        );
                      }
                    }
                  }
                );
              }
            );
          }
        );
      }
    });
  };
  init();
  if (process.argv[1]) {
    console.log("Change Dir:" + process.argv[1]);
    fs.stat(path.resolve(path.normalize(process.argv[1])), (err, staty) => {
      if (!staty.isFile()) {
        fs.access(
          path.resolve(path.normalize(process.argv[1])),
          fs.constants.R_OK,
          (err) => {
            if (!err) {
              cd(process.argv[1]);
            } else {
              console.log("Dir isn't Readable");
            }
          }
        );
      }
    });
  }
});
