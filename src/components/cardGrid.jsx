import React from "react";
import PropTypes from "prop-types";

// Create a functional component
const CardGrid = function(props) {
    let style = {
        gridTemplateColumns: `repeat(${props.columns},1fr)`,
        gridTemplateRows: `repeat(${props.rows},1fr)`
    };
    return (
        <div className="dataCard_container" style={style}>
            {props.children}
        </div>
    );
};

CardGrid.propTypes = {
    rows: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired
};

export default CardGrid;
