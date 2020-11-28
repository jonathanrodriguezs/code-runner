# Code Buster

My own prototype of a powerful online IDE and Editor.

## Languages available by docker images

- node:15.3.0-alpine3.10

## Memory reestriction on docker container

docker -m 64M --memory-swap 64M

## Compile and run

- Python:

```bash
docker run --rm -m 64M --memory-swap 64M --name cb8c6ecf-4afa-4fb0-9f46-a3a9dd982ca8 -v /runcode/input/cb8c6ecf-4afa-4fb0-9f46-a3a9dd982ca8:/code -w /code python:3.7-alpine python3 -u file.py
```

- C/C++:

```bash
docker run --rm -m 64M --memory-swap 64M --name 00854b7c-f768-406a-80cc-1851d2228920 -v /runcode/input/00854b7c-f768-406a-80cc-1851d2228920:/code -w /code cpp /bin/sh -c "g++ -Wall file.cpp -o a && ./a >&1 | tee"
```

- JavaScript:

```bash
docker run --rm -m 64M --memory-swap 64M -v /$(PWD):/code node:15.3.0-alpine3.10 node code/javascript.js
```
