from app.model import *
from app.visualization import *
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

import matplotlib
matplotlib.use("Agg")

app = Flask(__name__)
CORS(app)

@app.route('/api/viz_heatmap', methods = ['POST'])
def handle_viz_heatmap():
    try:
        data = request.get_json()

        msg = data.get('msg', "This is the default text.")
        layer = data.get('layer', 0)
        head = data.get('head', 0)

        model = Model()

        inputs = model.tokenizer(msg, return_tensors="pt")
        input_ids = inputs['input_ids'][0].tolist()
        tokens = model.tokenizer.convert_ids_to_tokens(input_ids)
        
        viz = Viz(model.get_attentions(msg))
        image_buffer = viz.viz_heatmap(tokens, layer, 0, head)

        return send_file(
            image_buffer,
            mimetype = "image/png",
            as_attachment = False
        )
    except Exception as e:
        print(f"Error generating graph: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)


