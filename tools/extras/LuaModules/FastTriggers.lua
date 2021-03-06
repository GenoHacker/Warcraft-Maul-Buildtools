---
--- Generated by EmmyLua(https://github.com/EmmyLua)
--- Created by henning.
--- DateTime: 15/07/2019 09:07
---
do
    local cMap = {}
    local aMap = {}
    local lastCondFunc
    local waitFunc

    local oldCond = Condition --If you don't want this Condition-overwrite behavior
    --for any particular resource, use Filter() instead of Condition(). This tool
    --is mainly for GUI users & the GUI->script compiled behavior uses Condition().
    function Condition(func)
        lastCondFunc = func
        return oldCond(func)
    end

    local oldTAC = TriggerAddCondition
    function TriggerAddCondition(trig, cond)
        if lastCondFunc then
            cMap[trig] = lastCondFunc --map the condition function to the trigger.
            lastCondFunc = nil
            cond = Filter(function()
                local t = GetTriggeringTrigger()
                if cMap[t]() then --Call the triggerconditions manually.
                    waitFunc = aMap[t]
                    waitFunc() --If this was caused by an event, call the trigger actions manually.
                end
            end)
        end
        return oldTAC(trig, cond) --use the regular event if a boolexpr or Filter
        --was used instead of Condition()
    end

    local oldTAA = TriggerAddAction
    function TriggerAddAction(trig, act)
        aMap[trig] = act
        return oldTAA(trig, function()
            waitFunc = aMap[GetTriggeringTrigger()]
            waitFunc() --If this was caused by an event, call the trigger actions manually.
        end)
    end

    local oldEval = TriggerEvaluate
    function TriggerEvaluate(trig)
        local f = cMap[trig]
        if f then return f() end
        return oldEval(trig)
    end

    local oldExec = TriggerExecute
    function TriggerExecute(trig)
        waitFunc = aMap[trig]
        waitFunc()
    end

    function RunTrigger(trig)
        local conds = cMap[trig]
        if IsTriggerEnabled(trig) and not conds or conds() then
            waitFunc = aMap[trig]
            waitFunc()
        end
    end

    local skipNext = false
    function EnableWaits()
        if skipNext then
            skipNext = false
            return false
        end
        skipNext = true
        coroutine.resume(coroutine.create(function()
            waitFunc()
        end))
        return true
    end
end
