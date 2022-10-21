# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.8.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.7.2...v2.8.0) (2022-10-21)


### Features

* Query upload file size limits from the backend ([7632696](https://gitlab.com/tms-elte/frontend-react/commit/76326962a422930e65e46469422b5b2891f62c65))


### Bug Fixes

* Grading window closes too easily ([d39c8bd](https://gitlab.com/tms-elte/frontend-react/commit/d39c8bd94034a0bc74e21ba22d49b7c8d9bd6e20))
* Make checkbox labels on mock login clickable ([4bdfbaf](https://gitlab.com/tms-elte/frontend-react/commit/4bdfbaf666e0d3fa48df126f2ba7e138400e678a))

### [2.7.2](https://gitlab.com/tms-elte/frontend-react/compare/v2.7.1...v2.7.2) (2022-09-19)


### Bug Fixes

* Properly save default submission status when grading. ([835eac4](https://gitlab.com/tms-elte/frontend-react/commit/835eac44cfd60049f05cdd0404278a53b4543db5))

### [2.7.1](https://gitlab.com/tms-elte/frontend-react/compare/v2.7.0...v2.7.1) (2022-09-19)


### Bug Fixes

* Correct status selected when regrading submissions ([c7eecb5](https://gitlab.com/tms-elte/frontend-react/commit/c7eecb5c80bc6133e13f8a81f1dee76c5bc641ac))
* Disable caching for index.html on Apache webservers ([2e5c635](https://gitlab.com/tms-elte/frontend-react/commit/2e5c635885cda6f69bd91f838dcb8d3242810138))

## [2.7.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.6.0...v2.7.0) (2022-05-15)


### Features

* Added easier mock login with predefined users ([059a191](https://gitlab.com/tms-elte/frontend-react/commit/059a1911e7ec22cdc5065174c1aff3be04f66d82))
* CodeCompass integration ([83deaaf](https://gitlab.com/tms-elte/frontend-react/commit/83deaaf6030c8adb865ece8384339678db69c8a9))
* Inform students about how to upload new solutions to a Canvas tasks ([cea8a36](https://gitlab.com/tms-elte/frontend-react/commit/cea8a368901c0207e5016a6e340025a27b18eef0))
* Password protected task user interface ([b450b92](https://gitlab.com/tms-elte/frontend-react/commit/b450b929b17e377d700a84c1f0afc5bda3a75290))
* Remote execution of web applications ([a379676](https://gitlab.com/tms-elte/frontend-react/commit/a379676280daa02e516319bb1e4913ec303bca8d))
* Show Canvas url for groups and tasks ([95f4148](https://gitlab.com/tms-elte/frontend-react/commit/95f4148068d7a4b864bd646ea64639b193d6dbb7))

## [2.6.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.5.0...v2.6.0) (2022-04-14)


### Features

* Added option to reevaluate ungraded submissions when modifying automated testing ([d52128f](https://gitlab.com/tms-elte/frontend-react/commit/d52128f2d50c0ba939dae4f05e232664958d5490))
* Display TMS version information and repository URL on bottom of the login page ([017eb70](https://gitlab.com/tms-elte/frontend-react/commit/017eb70ad3e1fc065c32cbed6848bf6b113f14f8))
* Display upload count for solutions ([15355fb](https://gitlab.com/tms-elte/frontend-react/commit/15355fb6d418845d5eb473e5d5ab547445e0090a))
* Optional sorting of student submissions. ([efacf07](https://gitlab.com/tms-elte/frontend-react/commit/efacf07803562691e9a34994cf19428d0e3d8575))


### Bug Fixes

* Disabled test creation for question sets without groups in the active semester ([72a103e](https://gitlab.com/tms-elte/frontend-react/commit/72a103e3cdafb5e97afed8038a5fa48a0e2e8e0a))

## [2.5.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.4.0...v2.5.0) (2022-03-28)


### Features

* Display local plagiarism results ([17eabc4](https://gitlab.com/tms-elte/frontend-react/commit/17eabc44b80387cd90e2976a69f99c0c80019ffa))
* Enable docker image update of auto tester ([d7ceeeb](https://gitlab.com/tms-elte/frontend-react/commit/d7ceeeb631a503e08f6d22e52412f65842b3750d))
* Grid view of tasks ([1195ccb](https://gitlab.com/tms-elte/frontend-react/commit/1195ccb0664c8e0ed8d169f639f604efcc101840))
* Sort students by their name and university identifier ([2644f16](https://gitlab.com/tms-elte/frontend-react/commit/2644f16f346fea8039cf740fa639ace5303ca5cc))

## [2.4.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.3.0...v2.4.0) (2022-03-22)


### Features

* Check backend version requirement ([f81ca7f](https://gitlab.com/tms-elte/frontend-react/commit/f81ca7fc55b323583b8f9a673de29d7d77acbe51))
* Default status for Failed submissions is Rejected ([601dcf6](https://gitlab.com/tms-elte/frontend-react/commit/601dcf6f512a4a1ff23abad1987a003c5242ea2d))
* File upload support for automatic tester ([9e5cb22](https://gitlab.com/tms-elte/frontend-react/commit/9e5cb2226d2e67e7ba2d5a19bf0e082c18df50dd))


### Bug Fixes

* Activating the automated tester resets the task deadlines ([5729574](https://gitlab.com/tms-elte/frontend-react/commit/57295743a6cef06ef8ad5dc01527c8f80c212478))
* Misleading error message upon oversized file upload ([faa4b26](https://gitlab.com/tms-elte/frontend-react/commit/faa4b266eb1b75dfe23b4f8f42ceea3891148dac))

## [2.3.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.2.0...v2.3.0) (2022-02-06)


### Features

* Command line arguments input for test cases ([4dfdcdf](https://gitlab.com/tms-elte/frontend-react/commit/4dfdcdf9ad3a91e2a2291e354c1d720a666bf2ee))

## [2.2.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.1.0...v2.2.0) (2021-12-07)


### Features

* Add user settings page ([490b143](https://gitlab.com/tms-elte/frontend-react/commit/490b143d7eaf69e07280d606b8d7ed383f6144af))
* Display finalized future exams ([b7341d0](https://gitlab.com/tms-elte/frontend-react/commit/b7341d0051686847fcd181d5c510154ace16d5b5))
* Sort student submissions by grading and date ([56fd09c](https://gitlab.com/tms-elte/frontend-react/commit/56fd09cf044c6d2a470b747bd99673e9a41c1105))

## [2.1.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.3...v2.1.0) (2021-10-27)


### Features

* Add a Markdown editor on the instructor interface for the task description ([80831b6](https://gitlab.com/tms-elte/frontend-react/commit/80831b6c91021a2dbadfd68c2dc997befd8c3185))
* Add insert table command to markdown editor ([3d1ef00](https://gitlab.com/tms-elte/frontend-react/commit/3d1ef00739001c2e15880c411d4376ba63f76bfd))
* Add support for GitHub Flavoured Markdown ([4a39ea8](https://gitlab.com/tms-elte/frontend-react/commit/4a39ea8d970fcac48436b722ee77de4f5b046d5d))
* Use Luxon and manage timezones ([075489f](https://gitlab.com/tms-elte/frontend-react/commit/075489fb5889facf9872bfeba5b0136283776f15))


### Bug Fixes

* Automated evaluator result not shown for accepted and rejected submissions ([ea3b2dd](https://gitlab.com/tms-elte/frontend-react/commit/ea3b2ddf97456917cf6bfc26024537774ba4cdd4))

### [2.0.3](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.2...v2.0.3) (2021-10-23)


### Bug Fixes

* Cleanup intervals and timeouts in TestWriterPage.tsx correctly ([6f00de8](https://gitlab.com/tms-elte/frontend-react/commit/6f00de8a02e5925fb3f75b41ff3ce3f4b1a78c4f))
* Display multiline plagiarism notes correctly ([63773a0](https://gitlab.com/tms-elte/frontend-react/commit/63773a03deafb249789fde0e8dd708f3a97cf4d2))
* Display multiline submission notes correctly ([6afc292](https://gitlab.com/tms-elte/frontend-react/commit/6afc292cc0de06694f3096e4772613b6e7eee63c))
* QuestionFormModal nad AnswerFormModal components should clear form fields when the user adds a new question or answer ([04104d8](https://gitlab.com/tms-elte/frontend-react/commit/04104d824a0a7604c743659e4311079a54eb91ac))
* Regular expressions are not escaped in DualListBoxControl.tsx ([2335b10](https://gitlab.com/tms-elte/frontend-react/commit/2335b102ef58ddc27aa49358907da7e2bad6b202))
* Translation issue on dynamic content after page reload ([63b13b1](https://gitlab.com/tms-elte/frontend-react/commit/63b13b151bdfd7181d6c72976e3105360073caf4))

### [2.0.2](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.1...v2.0.2) (2021-09-28)


### Bug Fixes

* Show the file upload form for tasks where the submission is in late submission status ([d9666c4](https://gitlab.com/tms-elte/frontend-react/commit/d9666c413be01e6bf8c0eb9d21a1ccdef0c66c2f), [b8ea521](https://gitlab.com/tms-elte/frontend-react/commit/b8ea52154a9705e53680ce8511cc1bb751d7150a))

## 2.0.0 (2021-09-22)


Initial public release.
