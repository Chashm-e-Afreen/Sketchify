use neon::prelude::*;
use neon::register_module;
use image::GenericImageView;

fn sketchify(mut cx: FunctionContext) ->  JsResult<JsString> {
    
    let path = cx.argument::<JsString>(0)?.value();
    let img = image::open(path).unwrap();
    let gray_img = img.grayscale();
    let mut gray_img_inverted = gray_img.clone();
    gray_img_inverted.invert();
    let blurred_img = gray_img_inverted.blur(6.0);
    let output_img = blend(gray_img, blurred_img);
    
    // Write the contents of this image to the Writer in JPEG format.
    output_img.save("output.jpg").unwrap();
    Ok(cx.string("output.jpg"))
}

pub fn blend(front_layer: image::DynamicImage , back_layer: image::DynamicImage) -> image::GrayImage{

    let (imgx, imgy) = front_layer.dimensions();

    let mut output_img: image::GrayImage = image::ImageBuffer::new(imgx, imgy);

    for x in 0..imgx {
        for y in 0..imgy {
            let front_pixel = front_layer.get_pixel(x, y)[0];
            let back_pixel = back_layer.get_pixel(x, y)[0];
            let output_pixel = image::Luma([blend_color_dodge(front_pixel, back_pixel)]);
            output_img.put_pixel(x,y,output_pixel);
        }
    }
    output_img
}

pub fn blend_color_dodge(x1: u8, x2: u8) -> u8 {
    if x2 == 255 {
        x2
    } else {
        //will need 16 bits to store the value after 8 left shifts
        let x1: u16 = x1 as u16;
        let x2: u16 = x2 as u16;
        //Left shifting 8 times is equivalent to multiplication with 256
        let rhs = (x1<<8)/(255-x2); 
        if 255 < rhs {
            255
        } else {
            rhs as u8
        }
    }
}

// register_module!(mut m, { m.export_function("helloWorld", hello_world) });
register_module!(mut m, { m.export_function("sketchify", sketchify) });