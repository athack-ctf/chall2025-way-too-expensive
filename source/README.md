# Running This Challenge

Build
```
docker build -t athack-ctf/chall2025-way-too-expensive:latest .
```

Run
```
docker run -d --name way-too-expensive \
  -p 52051:2025 \
  athack-ctf/chall2025-way-too-expensive:latest
```
