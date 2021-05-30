import React, { FC, PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import IItem from './IItem';
import { randomItemsArray } from './utils';

export interface IItemListProps {
    items: IItem[];
}

// CLASS VERSION BELOW. For functional version - look below it
// ------------------------------------------------------------------

class ItemAsClass extends PureComponent<IItem> {
    render() {
        return (
            <div className="App-item">
                {`Title is:${this.props.title}!`}
            </div>
        )
    }
}

class ItemsListAsClass extends PureComponent<IItemListProps> {
    render() {
        const { items } = this.props;
        return items.map(item => (
            <ItemAsClass key={item.id} {...item} />
        ))
    }
}

class AppAsClass extends PureComponent<{}, { items: IItem[] }> {

    state = {
        items: randomItemsArray(),
    }

    handleFillClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Add new items to the list
        this.setState({
            items: this.state.items.concat(randomItemsArray())
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <div>
                    <button className={"App-button"} onClick={this.handleFillClick}>
                        Add More
                    </button>
                </div>
                <div>
                    <ItemsListAsClass items={this.state.items} />
                </div>
            </div>
        );
    }
}

// FUNCTIONAL VERSION BELOW
// ------------------------------------------------------------------

function ItemAsFunction(item: IItem) {
    return (
        <div className="App-item">
            {`Title is:${item.title}!`}
        </div>
    )
}

function ItemsListAsFunction({ items }: IItemListProps) {
    return (
        <>
            {items.map(item => <ItemAsFunction key={item.id} {...item} />)}
        </>
    );
}

function AppAsFunction() {
    const [ items, setItems ] = React.useState(randomItemsArray());

    const handleFillClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Add new items to the list
        setItems(items.concat(randomItemsArray()));
    }

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div>
                <button className={"App-button"} onClick={handleFillClick}>
                    Add More
                </button>
            </div>
            <div>
                <ItemsListAsFunction items={items} />
            </div>
        </div>
    );
}

// OLD VERSION BELOW
// ------------------------------------------------------------------

function App() {
    // Comment to see previous version
    return (
        <>
            <AppAsClass />
            <AppAsFunction />
        </>
    );
    // d - List of items that can be updated with new additional items when the button is pressed
    var [d, set] = React.useState()

    var fill = () => {
        // The function fills the list for render with some items

        [...Array(20)].forEach((_, index) => {
            if (!Array.isArray(d)) {
                // @ts-ignore
                d = []
            }

            // @ts-ignore
            d.push({
                id: index, title: (function () {
                    var result = [];
                    for (var i = 0; i < 10; i++) {
                        result.push('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() *
                            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.length)));
                    }
                    var string = result.join('');
                    return string
                })()
            })
        })
        set(d)
    }

    // Fills the List onmount
    fill()

    var render = () => {
        // renders the list of items as components

        if (!Array.isArray(d)) {
            // @ts-ignore
            d = []
        }
        var result:any = []
        // @ts-ignore
        d.forEach(function (i, index) {
            result.push(<div className={'App-item'}>{'Title is:' + i.title + '!'}</div>)
        })
        return result
    }

    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
            </div>
            <div>
                <button className={"App-button"} onClick={() => {
                    // The Function adds new items to the existing list

                    if (!Array.isArray(d)) {
                        // @ts-ignore
                        d = []
                    }
                    [...Array(20)].forEach((_, index) => {
                        if (!Array.isArray(d)) {
                            // @ts-ignore
                            d = []
                        }
                        // @ts-ignore
                        d.push({
                            id: index, title: (function () {
                                var result = [];
                                for (var i = 0; i < 10; i++) {
                                    result.push('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() *
                                        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.length)));
                                }
                                var string = result.join('');
                                return string
                            })()
                        })
                    })
                    // @ts-ignore
                    set(d)
                }}>
                    Add More
                </button>
            </div>
            <div>
                {render()}
            </div>
        </div>
    );
}

export default App;
