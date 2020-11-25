use deno_core::plugin_api::{Interface, Op, ZeroCopyBuf};
use std::boxed::Box;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
    interface.register_op("renderOp", op_render);
}

pub fn op_render(_interface: &mut dyn Interface, zero_copy: &mut [ZeroCopyBuf]) -> Op {
    let mut exec = || -> Result<_, _> {
        let mut iter = zero_copy.iter_mut();
        let input = iter.next().ok_or("missing input")?;
        let input =
            std::str::from_utf8(&input).map_err(|err| format!("invalid string: {}", err))?;
        render(&input)
    };

    match exec() {
        Err(message) => {
            println!("{}", message);
            Op::Sync(Box::new([]))
        }
        Ok(png) => Op::Sync(png.into_boxed_slice()),
    }
}

fn render(svg: &str) -> Result<Vec<u8>, String> {
    let image = {
        let options = usvg::Options::default();
        let tree = usvg::Tree::from_str(svg, &options)
            .map_err(|err| format!("failed to parse svg: {}", err))?;
        resvg::render(&tree, usvg::FitTo::Original, None).ok_or("failed to render svg")?
    };

    let mut png = Vec::new();
    {
        let mut encoder = png::Encoder::new(&mut png, image.width(), image.height());

        encoder.set_color(png::ColorType::RGBA);
        encoder.set_depth(png::BitDepth::Eight);

        let mut writer = encoder
            .write_header()
            .map_err(|err| format!("failed to encode to png: {}", err))?;
        writer
            .write_image_data(image.data())
            .map_err(|err| format!("failed to encode to png: {}", err))?;
    }

    Ok(png)
}
