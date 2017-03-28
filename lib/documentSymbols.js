/* Copyright (c) Ben Mewburn ben@mewburn.id.au
 * Licensed under the MIT Licence.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const lsp = require("vscode-languageserver-types");
const namespacedSymbolMask = 2 /* Interface */ |
    1 /* Class */ |
    4 /* Trait */ |
    8 /* Constant */ |
    64 /* Function */;
function toDocumentSymbolInformation(s) {
    let si = {
        kind: null,
        name: s.name,
        location: s.location,
        containerName: s.scope
    };
    //check for symbol scope to exclude class constants
    if ((s.kind & namespacedSymbolMask) && !s.scope) {
        let nsSeparatorPos = s.name.lastIndexOf('\\');
        if (nsSeparatorPos >= 0) {
            si.name = s.name.slice(nsSeparatorPos + 1);
            si.containerName = s.name.slice(0, nsSeparatorPos);
        }
    }
    switch (s.kind) {
        case 1 /* Class */:
            si.kind = lsp.SymbolKind.Class;
            break;
        case 8 /* Constant */:
            si.kind = lsp.SymbolKind.Constant;
            break;
        case 64 /* Function */:
            si.kind = lsp.SymbolKind.Function;
            break;
        case 2 /* Interface */:
            si.kind = lsp.SymbolKind.Interface;
            break;
        case 32 /* Method */:
            if (s.name === '__construct') {
                si.kind = lsp.SymbolKind.Constructor;
            }
            else {
                si.kind = lsp.SymbolKind.Method;
            }
            break;
        case 512 /* Namespace */:
            si.kind = lsp.SymbolKind.Namespace;
            break;
        case 16 /* Property */:
            si.kind = lsp.SymbolKind.Property;
            break;
        case 4 /* Trait */:
            si.kind = lsp.SymbolKind.Module;
            break;
        case 256 /* Variable */:
        case 128 /* Parameter */:
            si.kind = lsp.SymbolKind.Variable;
            break;
        default:
            throw new Error(`Invalid argument ${s.kind}`);
    }
    return si;
}
class DocumentSymbolsProvider {
    constructor(symbolStore) {
        this.symbolStore = symbolStore;
    }
    provideDocumentSymbols(uri) {
        let symbolTable = this.symbolStore.getSymbolTable(uri);
        return symbolTable ?
            symbolTable.symbols.map(toDocumentSymbolInformation) :
            [];
    }
}
exports.DocumentSymbolsProvider = DocumentSymbolsProvider;