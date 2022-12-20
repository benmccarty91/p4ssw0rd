import { exec, ExecOptions } from 'child_process';

const execOptions: ExecOptions = {
  env: { 'DOCKER_BUILDKIT': '1' }
}

const projectId = process.env.PROJECT_ID ? process.env.PROJECT_ID : 'p4ssw0rd';
const appName = process.env.APP_NAME ? process.env.APP_NAME : 'p4ssw0rd.api';
const versionTag = process.env.VERSION_TAG ? process.env.VERSION_TAG : 'qa';
const imageName = `gcr.io/${projectId}/${appName}:${versionTag}`;

const command = `docker push ${imageName}`;

console.log(`exec ${command}`)
exec(command, execOptions, (err, stdout, stderr) => {
  if (err) {
    throw err;
  }
  if (stderr) {
    throw Error(stderr);
  }
  console.log(stdout);
})