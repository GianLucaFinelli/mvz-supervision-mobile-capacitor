#!/bin/bash
#! execute sh ./_bash-scripts/deploy-device.sh
ionic build
ionic cap copy
ionic cap sync
ionic cap run android -device
