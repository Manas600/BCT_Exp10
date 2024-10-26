import PropTypes from "prop-types";
import s from "./styles.module.css";

export default function Block({
  index,
  timestamp,
  data,
  hash,
  previousHash,
  nonce,
}) {
  return (
    <div className={s.block}>
      <h3>Block {index}</h3>
      <p>
        <strong>Timestamp:</strong> {timestamp}
      </p>
      <p>
        <strong>Nonce:</strong> {nonce} {/* Display nonce */}
      </p>
      <p>
        <strong>Data:</strong> {data}
      </p>
      <p>
        <strong>Hash:</strong> {hash}
      </p>
      <p>
        <strong>Previous Hash:</strong> {previousHash}
      </p>
    </div>
  );
}

Block.propTypes = {
  index: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  previousHash: PropTypes.string.isRequired,
  nonce: PropTypes.number.isRequired, // Validate nonce prop
};
