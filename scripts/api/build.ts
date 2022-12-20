import { exec, ExecOptions, spawn } from 'child_process';

const execOptions: ExecOptions = {
  cwd: '../p4ssw0rd.api/',
  env: { 'DOCKER_BUILDKIT': '1' }
}
const projectId = process.env.PROJECT_ID ? process.env.PROJECT_ID : 'p4ssw0rd';
const appName = process.env.APP_NAME ? process.env.APP_NAME : 'p4ssw0rd.api';
const versionTag = process.env.VERSION_TAG ? process.env.VERSION_TAG : 'qa';
const imageName = `gcr.io/${projectId}/${appName}:${versionTag}`;
const context = '.';
const dockerFilePath = './Dockerfile';


const command = `docker build -t ${imageName} -f ${dockerFilePath} ${context}`;

console.log(`exec ${command}`)
exec(command, execOptions, (err, stdout, sterr) => {
  if (err) {
    console.error(err);
    throw err;
  }
  if (sterr) {
    console.error(sterr);
    return;
  }
  console.log(stdout);
});