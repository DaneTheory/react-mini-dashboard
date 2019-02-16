import React from "react";
import PropTypes from "prop-types";

// Create a functional component
const CardGrid = function(props) {
    let style = {
        gridTemplateColumns: `repeat(${props.columns}, ${props.column_width})`,
        gridTemplateRows: `repeat(${props.rows},${props.row_height})`
    };
    return (
        <div className="dataCard_container" style={style}>
            {props.children}
        </div>
    );
};

// Set default props in case they aren't passed to us by the caller
CardGrid.defaultProps = {
    column_width: "1fr",
    row_height: "4.0vw"
};

CardGrid.propTypes = {
    rows: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default CardGrid;
