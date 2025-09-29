# Local Business Directory Management

This document outlines the approach for manually managing business directory listings.

## Overview

Instead of automated submission, we use a manual tracking system through TinaCMS for greater control and verification of business listings.

## Business Information

All business information needed for directory submissions is stored in:
- `content/settings/business.json` (under the `localSeo` section)

This includes:
- Business name and description
- Address and contact details
- Opening hours
- Tracking parameters (UTM)
- Images (logo, etc.)

## Directory Management

Business directory submissions are tracked in:
- `content/settings/directories.json`

This file is managed through TinaCMS under "Business Directories" section and allows you to:

1. Add new directories with their details
2. Update submission status (pending, submitted, live, needs_update, rejected, expired)
3. Add notes about each submission
4. Track the submission date (use DD-MM-YYYY format, e.g., 07-09-2025)
5. Record the live listing URL once published

## Manual Submission Process

1. Access directory data in TinaCMS
2. Open the target directory website
3. Use data from `business.json` to complete the directory's submission form
4. Update the status in TinaCMS to "submitted" once submitted
5. Add the submission date in DD-MM-YYYY format (e.g., 07-09-2025)
6. Check back periodically and update status to "live" once verified

## Benefits of Manual Approach

- Greater quality control over submissions
- Ability to manage verification steps (phone/email)
- No dependency on automation that may break with website changes
- Consistent tracking through TinaCMS interface
- Simplified maintenance without complex scripts

## Submission Statuses

When updating directories in TinaCMS, use these status values:

- **Pending** - Not yet submitted
- **Submitted** - Listing submitted but not yet live
- **Live** - Listing active and verified
- **Needs Update** - Listing requires changes
- **Rejected** - Submission was rejected
- **Expired** - Listing is no longer active and needs renewal

## Key Directory: Yell

The primary business directory for UK businesses is Yell. Ensure this listing is maintained and kept up-to-date with accurate business information.

For best results, maintain consistency in:
- Name, Address, Phone (NAP) details
- Business description
- Business hours
- Website URL (with tracking parameters)
