import { MultiplayerContextPassThrough } from "./MultiplayerContext";
import { MultiplayerGame } from "./MultiplayerGame";

const MultiplayerGameWithContext = ({ shapeProvider }) => {
    return <MultiplayerContextPassThrough>
        <MultiplayerGame shapeProvider={shapeProvider} />
    </MultiplayerContextPassThrough>;
}

export default MultiplayerGameWithContext;