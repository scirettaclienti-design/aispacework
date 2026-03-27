import cv2
import numpy as np
import sys

img_path = 'public/assets/ai_logo_flat.png'
out_path = 'public/assets/ai_logo_wireframe.png'

try:
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print("Error: Could not read image.")
        sys.exit(1)

    # We want a perfect outline. The new image is flat.
    if len(img.shape) == 3 and img.shape[2] == 4:
        mask = img[:,:,3]
        # Binarize alpha
        _, solid_mask = cv2.threshold(mask, 10, 255, cv2.THRESH_BINARY)
        # Find edges of the alpha mask
        edges = cv2.Canny(solid_mask, 100, 200)
    else:
        # If no alpha channel, binarize by color (assuming white background or similar)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Apply slight blur to smooth any rasterization artifacts
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        edges = cv2.Canny(blurred, 50, 150)

    # Dilate edges slightly (thickness = 2px) to make the gradient mask pop
    kernel = np.ones((2,2), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    h, w = edges.shape
    result = np.zeros((h, w, 4), dtype=np.uint8)
    result[:,:,0] = 255
    result[:,:,1] = 255
    result[:,:,2] = 255
    result[:,:,3] = edges

    cv2.imwrite(out_path, result)
    print("Perfect flat wireframe saved successfully!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
