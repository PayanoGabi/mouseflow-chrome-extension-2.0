/// <reference types="react" />
import PropTypes from "prop-types";
declare function Terminal(props: any): JSX.Element;
declare namespace Terminal {
    var propTypes: {
        enableInput: PropTypes.Requireable<boolean>;
        caret: PropTypes.Requireable<boolean>;
        theme: PropTypes.Requireable<string>;
        showControlBar: PropTypes.Requireable<boolean>;
        showControlButtons: PropTypes.Requireable<boolean>;
        controlButtonLabels: PropTypes.Requireable<string[]>;
        prompt: PropTypes.Requireable<string>;
        commands: PropTypes.Requireable<{
            [x: string]: NonNullable<((...args: any[]) => any) | PropTypes.ReactNodeLike>;
        }>;
        welcomeMessage: PropTypes.Requireable<NonNullable<((...args: any[]) => any) | PropTypes.ReactNodeLike>>;
        errorMessage: PropTypes.Requireable<NonNullable<((...args: any[]) => any) | PropTypes.ReactNodeLike>>;
        defaultHandler: PropTypes.Requireable<(...args: any[]) => any>;
    };
    var defaultProps: {
        enableInput: boolean;
        caret: boolean;
        theme: string;
        showControlBar: boolean;
        showControlButtons: boolean;
        controlButtonLabels: string[];
        prompt: string;
        commands: {};
        welcomeMessage: string;
        errorMessage: string;
        defaultHandler: any;
    };
}
export default Terminal;
