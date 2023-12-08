HubSync HTML Report Generator
==

--

## Installation

Please download and install nodejs latest version from https://nodejs.org/en/download 

```
git clone https://github.com/jayarajumetta/Hubsync-testrun-report.git

cd Hubsync-testrun-report/

npm run install-global-packages
npm install
```

* * *

## Documentation

For more information.

* * *

## Testing

### for Windows
    Update `branch` and `execution` names in windows_generate_report.bat file to generate the report by running below command
    [Example command]: 
    ```
    node src/get-executions.js -branch:"Unmerged scripts" -execution:"End to End - All / Regression"

    ```
### For linux or ubuntu or mac
    Update `branch` and `execution` namesnames in non_windows_generate_report.sh file to generate the report and run below command
    [Example command]: 
    ```
    node src/get-executions.js -branch:"Unmerged scripts" -execution:"End to End - All / Regression"

    ```
To test, go to the root folder and type below:

### run below command on Windows
    `windows_generate_report.bat`
### Run below command on linux/mac/ubuntu
    $ `./non_windows_generate_report.sh`
   
* * *
 
## Repo(s)

* [https://github.com/jayarajumetta/Hubsync-testrun-report](https://github.com/jayarajumetta/Hubsync-testrun-report.git)

* * *

## Contributing
