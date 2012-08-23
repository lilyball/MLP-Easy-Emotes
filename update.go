// Updates MLP Easy Emotes to the latest version from
// http://gamespotting.net/sandbox/easyEmotesGen.php

package main

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"github.com/kballard/go-osx-plist"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"sort"
)

const easyEmotesGen = "http://gamespotting.net/sandbox/easyEmotesGen.php?safariInit=on&vertOffset=&width=&height=&shouldGen=true&generate=mlpeasyemotes.user.js"
const extensionFolder = "MLP Easy Emotes.safariextension"
const updatePath = "update.plist"
const downloadFormatURL = "https://github.com/downloads/kballard/MLP-Easy-Emotes/MLP-Easy-Emotes-%s.safariextz"

var (
	scriptPath = filepath.Join(extensionFolder, "userscript.js")
	infoPath   = filepath.Join(extensionFolder, "Info.plist")
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("fatal: ")
	_, includes, err := parseScript()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Downloading script...")
	err = downloadScript()
	if err != nil {
		log.Fatalln(err)
	}
	version, newIncludes, err := parseScript()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Found version %s\n", version)
	filename, err := updatePlist(version)
	if err != nil {
		log.Fatalln(err)
	}
	if !reflect.DeepEqual(includes, newIncludes) {
		sub, add := diffIncludes(includes, newIncludes)
		if len(sub) > 0 {
			fmt.Println("Includes to remove:")
			for _, inc := range sub {
				fmt.Printf("  %s\n", inc)
			}
		}
		if len(add) > 0 {
			fmt.Println("Includes to add:")
			for _, inc := range add {
				fmt.Printf("  %s\n", inc)
			}
		}
	}
	fmt.Printf("Package name: %s\n", filename)
	fmt.Println("Complete")
}

func downloadScript() error {
	resp, err := http.Get(easyEmotesGen)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return errors.New(fmt.Sprintf("expected 200 OK, got %d", resp.StatusCode))
	}
	file, err := os.Create(scriptPath)
	if err != nil {
		return err
	}
	defer file.Close()
	reader := NewEOLConvReader(resp.Body)
	_, err = io.Copy(file, reader)
	return err
}

func parseScript() (version string, includes []string, err error) {
	file, err := os.Open(scriptPath)
	if err != nil {
		return
	}
	defer file.Close()
	reader := bufio.NewReader(file)
	line, isPrefix, err := reader.ReadLine()
	wasPrefix := false
	inMetadata := false
	for ; line != nil; line, isPrefix, err = reader.ReadLine() {
		// skip line continuations
		var b bool
		b, wasPrefix = wasPrefix, isPrefix
		if b {
			continue
		}

		if bytes.HasPrefix(line, []byte("//")) {
			if !inMetadata {
				if bytes.HasPrefix(line, []byte("// ==UserScript==")) {
					inMetadata = true
				}
				continue
			} else if bytes.HasPrefix(line, []byte("// ==/UserScript==")) {
				break
			}
			fields := bytes.Fields(line[2:]) // skip the //
			key := fields[0]
			value := line[cap(line)-cap(fields[1]):]
			switch string(key) {
			case "@include":
				includes = append(includes, string(value))
			case "@version":
				version = string(value)
			}
		}
	}
	if err == io.EOF {
		err = nil
	}
	return
}

func updatePlist(version string) (filename string, err error) {
	// Write the Info.plist
	plistData, err := ioutil.ReadFile(infoPath)
	if err != nil {
		return
	}
	var dict map[string]interface{}
	format, err := plist.Unmarshal(plistData, &dict)
	if err != nil {
		return
	}
	dict["CFBundleShortVersionString"] = version
	dict["CFBundleVersion"] = version
	if plistData, err = plist.Marshal(dict, format); err != nil {
		return
	}
	if err = ioutil.WriteFile(infoPath, plistData, 0644); err != nil {
		return
	}

	// Write the update.plist
	plistData, err = ioutil.ReadFile(updatePath)
	if err != nil {
		return
	}
	dict = nil
	format, err = plist.Unmarshal(plistData, &dict)
	if err != nil {
		return
	}
	subdict := dict["Extension Updates"].([]interface{})[0].(map[string]interface{})
	subdict["CFBundleShortVersionString"] = version
	subdict["CFBundleVersion"] = version
	downloadURL := fmt.Sprintf(downloadFormatURL, version)
	subdict["URL"] = downloadURL
	filename = filepath.Base(downloadURL)
	if plistData, err = plist.Marshal(dict, format); err != nil {
		return
	}
	if err = ioutil.WriteFile(updatePath, plistData, 0644); err != nil {
		return
	}
	return
}

// diffs the old and new includes slices and returns the differences.
// The old/new slices may be sorted as a byproduct of this function.
func diffIncludes(oldIncs, newIncs []string) (sub, add []string) {
	sort.Strings(oldIncs)
	sort.Strings(newIncs)
	for a, b := 0, 0; a < len(oldIncs) || b < len(newIncs); {
		if a >= len(oldIncs) {
			add = append(add, newIncs[b])
			b++
		} else if b >= len(newIncs) {
			sub = append(sub, oldIncs[a])
			a++
		} else if oldIncs[a] < newIncs[b] {
			sub = append(sub, oldIncs[a])
			a++
		} else if oldIncs[a] > newIncs[b] {
			add = append(add, newIncs[b])
			b++
		} else {
			a++
			b++
		}
	}
	return
}

// EOLConvReader is a Reader that swaps EOL to \n
type EOLConvReader struct {
	reader io.Reader
	skipNL bool
}

func NewEOLConvReader(r io.Reader) *EOLConvReader {
	return &EOLConvReader{reader: r}
}

func (r *EOLConvReader) Read(p []byte) (n int, err error) {
	n, err = r.reader.Read(p)
	for i := 0; i < n; i++ {
		c := p[i]
		if c == '\n' && r.skipNL {
			copy(p[i:], p[i+1:])
			i--
			n--
		}
		if c == '\r' {
			r.skipNL = true
			p[i] = '\n'
		} else {
			r.skipNL = false
		}
	}
	return
}
