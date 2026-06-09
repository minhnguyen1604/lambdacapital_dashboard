import os
import sys

def main():
    try:
        from PIL import Image, ImageDraw, ImageFont, ImageOps
    except ImportError:
        print("Pillow library is missing. Installing Pillow...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image, ImageDraw, ImageFont, ImageOps

    logo_path = "lc_logo.jpg"
    if not os.path.exists(logo_path):
        print(f"Error: Original logo file '{logo_path}' not found in the current directory.")
        sys.exit(1)

    print(f"Loading original logo: {logo_path}...")
    orig_logo = Image.open(logo_path)
    
    # Target height of 256px is the sweet spot for crisp browser downscaling
    # (avoiding bilinear blurriness from excessively large 512px+ canvases)
    target_height = 256
    logo_target_h = 256  # Fully fills the vertical canvas (0px vertical padding)
    spacing = 24         # Balanced horizontal gap
    
    # 1. Auto-crop white/near-white margins from the logo
    def crop_white_margins(img, tolerance=15):
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        
        # Find bounds of the actual logo symbol (non-white pixels)
        left, top, right, bottom = w, h, 0, 0
        pixels = img_rgb.load()
        for y in range(h):
            for x in range(w):
                r, g, b = pixels[x, y]
                # If color is not white/near-white
                if not (abs(r - 254) <= tolerance and abs(g - 254) <= tolerance and abs(b - 254) <= tolerance):
                    if x < left: left = x
                    if x > right: right = x
                    if y < top: top = y
                    if y > bottom: bottom = y
                    
        if left < right and top < bottom:
            # Add small padding to prevent clipping
            padding = 10
            left = max(0, left - padding)
            top = max(0, top - padding)
            right = min(w, right + padding)
            bottom = min(h, bottom + padding)
            return img.crop((left, top, right, bottom))
        return img

    print("Cropping white margins from logo...")
    cropped_logo = crop_white_margins(orig_logo)
    
    # Calculate scaled dimensions maintaining aspect ratio
    w_cropped, h_cropped = cropped_logo.size
    scale_factor = logo_target_h / h_cropped
    logo_target_w = int(w_cropped * scale_factor)
    
    print(f"Resized logo symbol from {w_cropped}x{h_cropped} to {logo_target_w}x{logo_target_h} (preserves aspect ratio)")

    # Font setup for Luxury Branding
    font_paths = [
        "C:\\Windows\\Fonts\\georgiab.ttf",   # Georgia Bold (Very high-end, prestigious)
        "C:\\Windows\\Fonts\\palab.ttf",     # Palatino Bold (Prestige serif)
        "C:\\Windows\\Fonts\\segoeuib.ttf",   # Segoe UI Bold (Geometric sans-serif)
        "C:\\Windows\\Fonts\\arialbd.ttf",    # Arial Bold (Standard sans-serif)
    ]
    
    font_bold = None
    for path in font_paths:
        if os.path.exists(path):
            try:
                # Optimized size for 256px height (text height is bold and prominent)
                font_bold = ImageFont.truetype(path, 100)
                print(f"Loaded premium title font: {os.path.basename(path)}")
                break
            except Exception as e:
                print(f"Failed to load font {path}: {e}")
                
    if font_bold is None:
        font_bold = ImageFont.load_default()
        print("Warning: Standard system fonts not found. Using default fallback.")

    # Text string
    text_to_draw = "LAMBDA CAPITAL"

    # Helper to calculate width of tracked text
    def get_tracked_text_width(text, font, letter_spacing):
        total_w = 0
        for char in text:
            bbox = font.getbbox(char)
            char_w = bbox[2] - bbox[0] if (bbox[2] > bbox[0]) else font.getbbox("x")[2] - font.getbbox("x")[0]
            if char == ' ':
                char_w = font.getbbox(" ")[2] - font.getbbox(" ")[0]
            total_w += char_w + letter_spacing
        return total_w - letter_spacing

    title_tracking = 11   # Optimized letter-spacing for 100px font size
    text_width = get_tracked_text_width(text_to_draw, font_bold, title_tracking)
    
    # 0px padding inside the image to maximize display size in CSS
    left_padding = 0
    right_padding = 0
    canvas_width = left_padding + logo_target_w + spacing + text_width + right_padding

    # Helper function to key out white background of the cropped logo
    def key_out_white(img, tolerance=15):
        img = img.convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            r, g, b, a = item
            if abs(r - 254) <= tolerance and abs(g - 254) <= tolerance and abs(b - 254) <= tolerance:
                new_data.append((255, 255, 255, 0)) # Make it transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        return img

    # Get scaled logo
    def get_scaled_logo():
        resized = cropped_logo.resize((logo_target_w, logo_target_h), Image.Resampling.LANCZOS)
        return key_out_white(resized)

    # Gradient Color values matching the logo symbol
    color_gold_start = (249, 155, 67, 255)
    color_gold_end = (216, 119, 40, 255)

    # Helper to draw character-by-character tracked text with a flawless horizontal gradient
    def draw_premium_text(img, text, font, start_x, y, color_start, color_end, letter_spacing):
        # 1. First pass: measure characters and get horizontal positions
        current_x = start_x
        char_positions = []
        for char in text:
            bbox = font.getbbox(char)
            char_w = bbox[2] - bbox[0] if (bbox[2] > bbox[0]) else font.getbbox("x")[2] - font.getbbox("x")[0]
            if char == ' ':
                char_w = font.getbbox(" ")[2] - font.getbbox(" ")[0]
            
            char_positions.append((char, current_x, bbox))
            current_x += char_w + letter_spacing
            
        total_width = current_x - start_x - letter_spacing
        
        # Get font bounding box to find vertical bounds
        font_bbox = font.getbbox("LAMBDA CAPITAL")
        text_h = font_bbox[3] - font_bbox[1]
        
        # 2. Create a temporary image layer for the text mask (L mode)
        padding = 10
        mask_w = total_width + (padding * 2)
        mask_h = text_h + (padding * 2)
        text_mask = Image.new("L", (mask_w, mask_h), 0)
        mask_draw = ImageDraw.Draw(text_mask)
        
        # Draw letters onto the mask
        for char, cx, bbox in char_positions:
            rx = cx - start_x + padding
            ry = padding - font_bbox[1]
            mask_draw.text((rx, ry), char, fill=255, font=font)
            
        # 3. Create a horizontal gradient image of the same size
        gradient_img = Image.new("RGBA", (mask_w, mask_h))
        g_draw = ImageDraw.Draw(gradient_img)
        for gx in range(mask_w):
            t = gx / mask_w
            r = int(color_start[0] + (color_end[0] - color_start[0]) * t)
            g_val = int(color_start[1] + (color_end[1] - color_start[1]) * t)
            b = int(color_start[2] + (color_end[2] - color_start[2]) * t)
            a = int(color_start[3] + (color_end[3] - color_start[3]) * t)
            g_draw.line([(gx, 0), (gx, mask_h)], fill=(r, g_val, b, a))
            
        # 4. Paste gradient onto main canvas using the mask
        dest_x = start_x - padding
        dest_y = y - padding
        
        temp_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        temp_layer.paste(gradient_img, (dest_x, dest_y), text_mask)
        img.alpha_composite(temp_layer)
        
        return total_width

    # MAIN GENERATION
    print("Generating ultra-premium combined logo...")
    img = Image.new("RGBA", (canvas_width, target_height), (0, 0, 0, 0)) # Transparent background
    
    # 1. Paste scaled, keyed logo
    logo = get_scaled_logo()
    logo_y = (target_height - logo.height) // 2
    logo_x = left_padding
    img.paste(logo, (logo_x, logo_y), logo)
    
    # Calculate vertical positions - mathematically centered on canvas
    text_x = logo_x + logo_target_w + spacing
    
    # Draw luxury gradient tracked brand title
    font_bbox = font_bold.getbbox(text_to_draw)
    title_draw_y = target_height // 2 - (font_bbox[1] + font_bbox[3]) // 2
    
    print("Drawing brand title with metallic gold gradient and tracking...")
    draw_premium_text(
        img=img, 
        text=text_to_draw, 
        font=font_bold, 
        start_x=text_x, 
        y=title_draw_y, 
        color_start=color_gold_start, 
        color_end=color_gold_end, 
        letter_spacing=title_tracking
    )

    # Save output (the selected transparent version)
    output_filename = "lambda_capital_logo_combined_keyed_light.png"
    img.save(output_filename, "PNG")
    print(f"\nUltra-premium logo successfully generated and saved to: {output_filename}")

if __name__ == "__main__":
    main()
