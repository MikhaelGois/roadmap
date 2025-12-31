# LGPD Notes

- Only collect necessary personal data: client name, phone, address required for delivery.
- Store personal data encrypted at rest where possible (DB level encryption or field-level encryption for sensitive fields).
- Provide endpoints for data subject requests: data access, rectification, deletion.
- Keep proof-of-delivery (photo) retention policy: keep for 30-90 days by default, purge older proofs via scheduled job.
- Ensure third-party services (Mapbox, S3) have appropriate contracts and data processing agreements.
- Log access to personal data and require operator authentication/authorization for viewing.
