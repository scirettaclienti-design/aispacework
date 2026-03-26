import cv2
import numpy as np
import sys

# Read image
img_path = 'public/assets/ai_logo_3d.png'
out_path = 'public/assets/ai_logo_wireframe.png'

try:
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Error: Could not read image.")
        sys.exit(1)

    # Convert to grayscale
    if img.shape[2] == 4:
        # Use alpha channel to mask background to black before edge detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
        mask = img[:,:,3]
        gray = cv2.bitwise_and(gray, gray, mask=mask)
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Canny edge detection
    # Use low threshold to get lots of detail, high threshold to filter noise
    edges = cv2.Canny(gray, 20, 80)

    # The result 'edges' is white lines (255) on black background (0).
    # We want the white lines to be opaque white, and black to be fully transparent.
    h, w = edges.shape
    result = np.zeros((h, w, 4), dtype=np.uint8)
    result[:,:,0] = 255 # R
    result[:,:,1] = 255 # G
    result[:,:,2] = 255 # B
    result[:,:,3] = edges # Alpha channel

    cv2.imwrite(out_path, result)
    print("Wireframe saved successfully!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
