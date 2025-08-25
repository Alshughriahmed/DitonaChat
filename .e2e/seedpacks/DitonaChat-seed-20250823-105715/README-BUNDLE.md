# DitonaChat Bundle

## Run (dev)
```bash
cd "/home/runner/workspace/ditonachat-clean/DitonaChat-bundle-20250822-163606"
./ops/run-dev.sh
```

## Smoke
في تبويب آخر:
```bash
./ops/smoke.sh
```

- الشبكة: dev على :3001
- مسارات stubs: /api/health (200), /api/subscription/status (200), GET webhook (405), POST webhook (200)
- افتح /chat خارج أي IFRAME. تجاوز بوابة العمر عبر Cookie ageok=1.
